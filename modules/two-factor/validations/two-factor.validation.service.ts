import { validateWithSchema, ValidationResult } from "@/lib/validation";
import {
  TwoFactorInput,
  SendTwoFactorInput,
  twoFactorSchema,
  sendTwoFactorSchema,
} from "./schema/two-factor.schema";

export type { ValidationResult };

export class TwoFactorValidationService {
  public validateVerifyCode(data: TwoFactorInput): ValidationResult<TwoFactorInput> {
    return validateWithSchema(twoFactorSchema, data);
  }

  public validateSendCode(data: SendTwoFactorInput): ValidationResult<SendTwoFactorInput> {
    return validateWithSchema(sendTwoFactorSchema, data);
  }
}
