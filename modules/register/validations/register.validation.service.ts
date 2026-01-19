import {
  RegisterUser,
  createRegisterFormSchema,
} from "./schema/register.schema";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: RegisterUser;
}

export class RegisterValidationService {
  public validateInputData(data: RegisterUser): ValidationResult {
    const validatedFields = createRegisterFormSchema.safeParse(data);

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
