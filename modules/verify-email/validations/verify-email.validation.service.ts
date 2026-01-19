import {
  VerifyEmailInput,
  verifyEmailSchema,
} from "./schema/verify-email.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: VerifyEmailInput;
}

export class VerifyEmailValidationService {
  public validateInputData(data: VerifyEmailInput): ValidationResult {
    const validatedFields = verifyEmailSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Token inválido",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
