import { ForgotPasswordRepository } from "../repository/forgot-password.repository";
import { ForgotPasswordValidationService } from "../validations/forgot-password.validation.service";
import { ForgotPasswordInput } from "../validations/schema/forgot-password.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  email?: string;
  shouldSendEmail?: boolean;
}

export class ForgotPasswordDomainService {
  private repository: ForgotPasswordRepository;
  private validationService: ForgotPasswordValidationService;

  constructor() {
    this.repository = new ForgotPasswordRepository();
    this.validationService = new ForgotPasswordValidationService();
  }

  public async validateForgotPasswordRequest(
    input: ForgotPasswordInput
  ): Promise<DomainValidationResult> {
    const validationResult = this.validationService.validateInputData(input);

    if (!validationResult.isValid || !validationResult.data) {
      return {
        isValid: false,
        error: validationResult.error ?? "Campos inválidos",
      };
    }

    const { email } = validationResult.data;
    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      return {
        isValid: true,
        shouldSendEmail: false,
        email,
      };
    }

    return {
      isValid: true,
      shouldSendEmail: true,
      email,
    };
  }
}
