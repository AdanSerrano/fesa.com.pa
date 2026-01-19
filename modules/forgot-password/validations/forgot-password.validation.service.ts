import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "./schema/forgot-password.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ForgotPasswordInput;
}

export class ForgotPasswordValidationService {
  public validateInputData(data: ForgotPasswordInput): ValidationResult {
    const validatedFields = forgotPasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Campos inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
