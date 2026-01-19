import { z } from "zod";
import { AuthErrorCode } from "./errors";

export interface FieldError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  errorCode?: AuthErrorCode;
  fieldErrors?: FieldError[];
  data?: T;
}

/**
 * Valida datos con un schema Zod y retorna errores específicos por campo
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Extraer errores específicos por campo (Zod v4 usa .issues)
    const fieldErrors: FieldError[] = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    // Usar el primer error como mensaje principal
    const firstError = fieldErrors[0];
    const errorMessage = firstError
      ? `${getFieldLabel(firstError.field)}: ${firstError.message}`
      : "Datos inválidos";

    return {
      isValid: false,
      error: errorMessage,
      errorCode: AuthErrorCode.VALIDATION_ERROR,
      fieldErrors,
    };
  }

  return {
    isValid: true,
    data: result.data,
  };
}

/**
 * Convierte nombres de campo a labels legibles
 */
function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    identifier: "Email o usuario",
    email: "Email",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    name: "Nombre",
    userName: "Nombre de usuario",
    code: "Código",
    token: "Token",
  };

  return labels[field] || field;
}

/**
 * Crea un resultado de validación exitoso
 */
export function validationSuccess<T>(data: T): ValidationResult<T> {
  return {
    isValid: true,
    data,
  };
}

/**
 * Crea un resultado de validación con error
 */
export function validationError<T>(
  message: string,
  code?: AuthErrorCode,
  fieldErrors?: FieldError[]
): ValidationResult<T> {
  return {
    isValid: false,
    error: message,
    errorCode: code || AuthErrorCode.VALIDATION_ERROR,
    fieldErrors,
  };
}
