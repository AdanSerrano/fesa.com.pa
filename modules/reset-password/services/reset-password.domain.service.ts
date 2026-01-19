import { ResetPasswordRepository } from "../repository/reset-password.repository";
import { ResetPasswordValidationService } from "../validations/reset-password.validation.service";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
  userId?: string;
  tokenId?: string;
  password?: string;
  email?: string;
}

export class ResetPasswordDomainService {
  private repository: ResetPasswordRepository;
  private validationService: ResetPasswordValidationService;

  constructor() {
    this.repository = new ResetPasswordRepository();
    this.validationService = new ResetPasswordValidationService();
  }

  public async validateResetPasswordRequest(
    input: ResetPasswordInput
  ): Promise<DomainValidationResult> {
    const validationResult = this.validationService.validateInputData(input);

    if (!validationResult.isValid || !validationResult.data) {
      return {
        isValid: false,
        error: validationResult.error ?? "Campos inválidos",
      };
    }

    const { token, password } = validationResult.data;

    const passwordResetToken =
      await this.repository.getPasswordResetTokenByToken(token);

    if (!passwordResetToken) {
      return {
        isValid: false,
        error: "Token inválido o expirado",
      };
    }

    const hasExpired = new Date(passwordResetToken.expires) < new Date();
    if (hasExpired) {
      return {
        isValid: false,
        error: "El enlace ha expirado. Solicita uno nuevo.",
      };
    }

    const user = await this.repository.getUserByEmail(passwordResetToken.email);
    if (!user) {
      return {
        isValid: false,
        error: "Usuario no encontrado",
      };
    }

    return {
      isValid: true,
      userId: user.id,
      tokenId: passwordResetToken.id,
      password,
      email: passwordResetToken.email,
    };
  }
}
