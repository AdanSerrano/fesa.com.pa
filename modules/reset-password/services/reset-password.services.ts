import bcrypt from "bcryptjs";
import { ResetPasswordRepository } from "../repository/reset-password.repository";
import { ResetPasswordDomainService } from "./reset-password.domain.service";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";
import { resetFailedAttempts } from "@/lib/account-security";

export interface ResetPasswordResult {
  success?: string;
  error?: string;
}

export class ResetPasswordService {
  private repository: ResetPasswordRepository;
  private domainService: ResetPasswordDomainService;

  constructor() {
    this.repository = new ResetPasswordRepository();
    this.domainService = new ResetPasswordDomainService();
  }

  public async resetPassword(
    input: ResetPasswordInput
  ): Promise<ResetPasswordResult> {
    try {
      const validation =
        await this.domainService.validateResetPasswordRequest(input);

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const hashedPassword = await bcrypt.hash(validation.password!, 10);

      await this.repository.updateUserPassword(
        validation.userId!,
        hashedPassword
      );

      await this.repository.deletePasswordResetToken(validation.tokenId!);

      // Resetear intentos fallidos después de cambiar contraseña
      await resetFailedAttempts(validation.userId!);

      return {
        success: "¡Contraseña actualizada! Ya puedes iniciar sesión.",
      };
    } catch (error) {
      console.error("Error en reset password service:", error);
      return { error: "Error al restablecer la contraseña" };
    }
  }
}
