import { generateTwoFactorToken } from "@/lib/tokens";
import { TwoFactorRepository } from "../repository/two-factor.repository";
import { TwoFactorDomainService } from "./two-factor.domain.service";
import { sendTwoFactorEmail } from "../emails/two-factor.emails";
import { TwoFactorInput, SendTwoFactorInput } from "../validations/schema/two-factor.schema";

export interface TwoFactorResult {
  success?: string;
  error?: string;
  requiresTwoFactor?: boolean;
}

export class TwoFactorService {
  private repository: TwoFactorRepository;
  private domainService: TwoFactorDomainService;

  constructor() {
    this.repository = new TwoFactorRepository();
    this.domainService = new TwoFactorDomainService();
  }

  public async sendTwoFactorCode(
    input: SendTwoFactorInput
  ): Promise<TwoFactorResult> {
    try {
      const validation = await this.domainService.validateUserForTwoFactor(
        input.email
      );

      if (!validation.isValid || !validation.user) {
        return { error: validation.error };
      }

      const twoFactorToken = await generateTwoFactorToken(input.email);
      await sendTwoFactorEmail(input.email, twoFactorToken.token);

      return {
        success: "Código enviado a tu correo electrónico",
        requiresTwoFactor: true,
      };
    } catch (error) {
      console.error("Error en send two factor code:", error);
      return { error: "Error al enviar el código de verificación" };
    }
  }

  public async verifyTwoFactorCode(
    input: TwoFactorInput
  ): Promise<TwoFactorResult> {
    try {
      const validation = await this.domainService.validateTwoFactorCode(input);

      if (!validation.isValid || !validation.userId || !validation.tokenId) {
        return { error: validation.error };
      }

      await this.repository.deleteTwoFactorToken(validation.tokenId);

      const existingConfirmation =
        await this.repository.getTwoFactorConfirmationByUserId(
          validation.userId
        );

      if (existingConfirmation) {
        await this.repository.deleteTwoFactorConfirmation(
          existingConfirmation.id
        );
      }

      await this.repository.createTwoFactorConfirmation(validation.userId);

      return { success: "Código verificado correctamente" };
    } catch (error) {
      console.error("Error en verify two factor code:", error);
      return { error: "Error al verificar el código" };
    }
  }

  public async toggleTwoFactor(
    userId: string,
    enable: boolean
  ): Promise<TwoFactorResult> {
    try {
      await this.repository.updateUserTwoFactorEnabled(userId, enable);

      return {
        success: enable
          ? "Autenticación de dos factores activada"
          : "Autenticación de dos factores desactivada",
      };
    } catch (error) {
      console.error("Error en toggle two factor:", error);
      return { error: "Error al cambiar la configuración de 2FA" };
    }
  }
}
