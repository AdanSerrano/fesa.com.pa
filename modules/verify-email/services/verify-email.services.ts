import { VerifyEmailRepository } from "../repository/verify-email.repository";
import { VerifyEmailDomainService } from "./verify-email.domain.service";
import { VerifyEmailInput } from "../validations/schema/verify-email.schema";

export interface VerifyEmailResult {
  success?: string;
  error?: string;
}

export class VerifyEmailService {
  private repository: VerifyEmailRepository;
  private domainService: VerifyEmailDomainService;

  constructor() {
    this.repository = new VerifyEmailRepository();
    this.domainService = new VerifyEmailDomainService();
  }

  public async verify(input: VerifyEmailInput): Promise<VerifyEmailResult> {
    try {
      const validation =
        await this.domainService.validateVerificationToken(input);

      if (!validation.isValid || !validation.tokenData) {
        return { error: validation.error };
      }

      const { tokenId, userId, email } = validation.tokenData;

      await this.repository.markEmailAsVerified(userId, email);
      await this.repository.deleteVerificationToken(tokenId);

      return { success: "¡Tu email ha sido verificado correctamente!" };
    } catch (error) {
      console.error("Error en verify email service:", error);
      return { error: "Error al verificar el email" };
    }
  }
}
