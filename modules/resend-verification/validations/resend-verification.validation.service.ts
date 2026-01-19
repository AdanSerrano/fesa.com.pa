import {
  ResendVerificationInput,
  resendVerificationSchema,
} from "./schema/resend-verification.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ResendVerificationInput;
}

export class ResendVerificationValidationService {
  public validateInputData(data: ResendVerificationInput): ValidationResult {
    const validatedFields = resendVerificationSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Email inválido",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
