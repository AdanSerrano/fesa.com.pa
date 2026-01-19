import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "./schema/reset-password.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ResetPasswordInput;
}

export class ResetPasswordValidationService {
  public validateInputData(data: ResetPasswordInput): ValidationResult {
    const validatedFields = resetPasswordSchema.safeParse(data);

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
