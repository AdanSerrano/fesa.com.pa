import { generatePasswordResetToken } from "@/lib/tokens";
import { checkRateLimit, formatResetTime } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "../emails/forgot-password.emails";
import { ForgotPasswordDomainService } from "./forgot-password.domain.service";
import { ForgotPasswordInput } from "../validations/schema/forgot-password.schema";

const GENERIC_SUCCESS_MESSAGE =
  "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.";

export interface ForgotPasswordResult {
  success?: string;
  error?: string;
  rateLimited?: boolean;
}

export class ForgotPasswordService {
  private domainService: ForgotPasswordDomainService;

  constructor() {
    this.domainService = new ForgotPasswordDomainService();
  }

  public async requestPasswordReset(
    input: ForgotPasswordInput
  ): Promise<ForgotPasswordResult> {
    try {
      const rateLimitKey = `forgot-password:${input.email.toLowerCase()}`;
      const rateLimit = checkRateLimit(rateLimitKey);

      if (!rateLimit.allowed) {
        return {
          error: `Demasiados intentos. Intenta de nuevo en ${formatResetTime(rateLimit.resetIn)}.`,
          rateLimited: true,
        };
      }

      const validation =
        await this.domainService.validateForgotPasswordRequest(input);

      if (!validation.isValid) {
        return { error: validation.error };
      }

      if (!validation.shouldSendEmail) {
        return { success: GENERIC_SUCCESS_MESSAGE };
      }

      const passwordResetToken = await generatePasswordResetToken(
        validation.email!
      );
      await sendPasswordResetEmail(validation.email!, passwordResetToken.token);

      return { success: GENERIC_SUCCESS_MESSAGE };
    } catch (error) {
      console.error("Error en forgot password service:", error);
      return { error: "Error al procesar la solicitud" };
    }
  }
}
