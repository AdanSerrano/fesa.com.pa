import bcrypt from "bcryptjs";
import { resetRateLimit } from "@/lib/rate-limit";
import { ResetPasswordRepository } from "../repository/reset-password.repository";
import { ResetPasswordDomainService } from "./reset-password.domain.service";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";

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

      resetRateLimit(validation.email!.toLowerCase());

      return {
        success: "¡Contraseña actualizada! Ya puedes iniciar sesión.",
      };
    } catch (error) {
      console.error("Error en reset password service:", error);
      return { error: "Error al restablecer la contraseña" };
    }
  }
}
