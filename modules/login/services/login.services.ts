import { generateTwoFactorToken } from "@/lib/tokens";
import { db } from "@/utils/db";
import { sendTwoFactorEmail } from "@/modules/two-factor/emails/two-factor.emails";
import { LoginUser } from "../validations/schema/login.schema";
import { LoginAuthService, AuthResult } from "./login.auth.service";
import { LoginDomainService } from "./login.domain.service";
import {
  checkAccountLock,
  recordFailedLogin,
  resetFailedAttempts,
} from "@/lib/account-security";
import { logLoginSuccess } from "@/lib/audit";
import bcrypt from "bcryptjs";

export interface LoginResult extends AuthResult {
  rateLimited?: boolean;
  remainingAttempts?: number;
  requiresTwoFactor?: boolean;
  email?: string;
}

export class LoginService {
  private loginDomainService: LoginDomainService;
  private loginAuthService: LoginAuthService;

  constructor() {
    this.loginDomainService = new LoginDomainService();
    this.loginAuthService = new LoginAuthService();
  }

  public async login(loginUser: LoginUser): Promise<LoginResult> {
    try {
      // 1. Validar datos de entrada y obtener usuario
      const domainValidation =
        await this.loginDomainService.validateLoginBusinessRules(loginUser);

      if (!domainValidation.isValid) {
        return {
          error: domainValidation.error,
          redirect: domainValidation.redirect,
        };
      }

      const identifier = domainValidation.identifier;
      const user = domainValidation.user;

      if (!identifier || !user) {
        return { error: "Error interno de validación" };
      }

      // 2. Verificar si la cuenta está bloqueada
      const accountLock = await checkAccountLock(user.id);
      if (!accountLock.allowed) {
        return {
          error: accountLock.error?.message || "Cuenta bloqueada temporalmente",
          rateLimited: true,
        };
      }

      // 3. Verificar contraseña
      const passwordMatch = await bcrypt.compare(loginUser.password, user.password);
      if (!passwordMatch) {
        // Registrar intento fallido en la base de datos
        const failedResult = await recordFailedLogin(
          user.id,
          user.email || identifier,
          "Contraseña incorrecta"
        );

        if (!failedResult.allowed) {
          return {
            error: failedResult.error?.message || "Cuenta bloqueada por demasiados intentos fallidos",
            rateLimited: true,
          };
        }

        return {
          error: "Contraseña incorrecta",
          remainingAttempts: failedResult.remainingAttempts,
        };
      }

      // 4. Contraseña correcta - proceder con 2FA si está habilitado
      if (user.isTwoFactorEnabled && user.email) {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
          where: { userId: user.id },
        });

        if (twoFactorConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        } else {
          const twoFactorToken = await generateTwoFactorToken(user.email);
          await sendTwoFactorEmail(user.email, twoFactorToken.token);

          return {
            requiresTwoFactor: true,
            email: user.email,
            success: "Código de verificación enviado",
          };
        }
      }

      // 5. Autenticar usuario
      const authResult = await this.loginAuthService.authenticateUser(
        identifier,
        loginUser.password
      );

      // 6. Si login exitoso, resetear intentos fallidos y registrar
      if (authResult.success) {
        await resetFailedAttempts(user.id);
        await logLoginSuccess(user.id);
      }

      return authResult;
    } catch (error) {
      console.error("Error en login service:", error);
      return { error: "Error al verificar credenciales" };
    }
  }
}
