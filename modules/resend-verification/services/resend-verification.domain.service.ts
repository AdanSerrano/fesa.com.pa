import { ResendVerificationRepository } from "../repository/resend-verification.repository";
import { ResendVerificationValidationService } from "../validations/resend-verification.validation.service";
import { ResendVerificationInput } from "../validations/schema/resend-verification.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  shouldSendEmail: boolean;
  email?: string;
}

export class ResendVerificationDomainService {
  private repository: ResendVerificationRepository;
  private validationService: ResendVerificationValidationService;

  constructor() {
    this.repository = new ResendVerificationRepository();
    this.validationService = new ResendVerificationValidationService();
  }

  public async validateResendRequest(
    input: ResendVerificationInput
  ): Promise<DomainValidationResult> {
    try {
      const validationResult = this.validationService.validateInputData(input);

      if (!validationResult.isValid || !validationResult.data) {
        return {
          isValid: false,
          shouldSendEmail: false,
          error: validationResult.error ?? "Email inválido",
        };
      }

      const user = await this.repository.getUserByEmail(input.email);

      if (!user) {
        return {
          isValid: true,
          shouldSendEmail: false,
        };
      }

      if (user.emailVerified) {
        return {
          isValid: true,
          shouldSendEmail: false,
        };
      }

      return {
        isValid: true,
        shouldSendEmail: true,
        email: input.email.toLowerCase(),
      };
    } catch {
      return {
        isValid: false,
        shouldSendEmail: false,
        error: "Error al validar la solicitud",
      };
    }
  }
}
