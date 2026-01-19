import { VerifyEmailRepository } from "../repository/verify-email.repository";
import { VerifyEmailValidationService } from "../validations/verify-email.validation.service";
import { VerifyEmailInput } from "../validations/schema/verify-email.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  tokenData?: {
    tokenId: string;
    userId: string;
    email: string;
  };
}

export class VerifyEmailDomainService {
  private repository: VerifyEmailRepository;
  private validationService: VerifyEmailValidationService;

  constructor() {
    this.repository = new VerifyEmailRepository();
    this.validationService = new VerifyEmailValidationService();
  }

  public async validateVerificationToken(
    input: VerifyEmailInput
  ): Promise<DomainValidationResult> {
    try {
      const validationResult = this.validationService.validateInputData(input);

      if (!validationResult.isValid || !validationResult.data) {
        return {
          isValid: false,
          error: validationResult.error ?? "Token inválido",
        };
      }

      const existingToken = await this.repository.getVerificationToken(
        input.token
      );

      if (!existingToken) {
        return {
          isValid: false,
          error: "El token de verificación no existe o ya fue usado",
        };
      }

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) {
        return {
          isValid: false,
          error: "El token de verificación ha expirado",
        };
      }

      const user = await this.repository.getUserByEmail(existingToken.email);

      if (!user) {
        return {
          isValid: false,
          error: "El usuario no existe",
        };
      }

      return {
        isValid: true,
        tokenData: {
          tokenId: existingToken.id,
          userId: user.id,
          email: existingToken.email,
        },
      };
    } catch (error) {
      console.error("Error in domain validation:", error);
      return {
        isValid: false,
        error: "Error al validar el token",
      };
    }
  }
}
