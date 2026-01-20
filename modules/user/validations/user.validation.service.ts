import {
  updateProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
  deleteAccountSchema,
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "./schema/user.schema";

export interface ValidationResult<T = unknown> {
  isValid: boolean;
  error?: string;
  data?: T;
}

export class UserValidationService {
  public validateProfileData(
    data: UpdateProfileInput
  ): ValidationResult<UpdateProfileInput> {
    const validatedFields = updateProfileSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Datos de perfil inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }

  public validateEmailData(
    data: UpdateEmailInput
  ): ValidationResult<UpdateEmailInput> {
    const validatedFields = updateEmailSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Datos de email inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }

  public validatePasswordData(
    data: UpdatePasswordInput
  ): ValidationResult<UpdatePasswordInput> {
    const validatedFields = updatePasswordSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Datos de contraseña inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }

  public validateDeleteData(
    data: DeleteAccountInput
  ): ValidationResult<DeleteAccountInput> {
    const validatedFields = deleteAccountSchema.safeParse(data);

    if (!validatedFields.success) {
      const firstIssue = validatedFields.error.issues[0];
      return {
        isValid: false,
        error: firstIssue?.message ?? "Datos de confirmación inválidos",
      };
    }

    return {
      isValid: true,
      data: validatedFields.data,
    };
  }
}
