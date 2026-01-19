import { validateWithSchema, ValidationResult } from "@/lib/validation";
import { LoginUser, createLoginFormSchema } from "./schema/login.schema";

export type { ValidationResult };

export class LoginValidationService {
  public validateInputData(data: LoginUser): ValidationResult<LoginUser> {
    return validateWithSchema(createLoginFormSchema, data);
  }
}
