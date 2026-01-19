import { ForgotPasswordService } from "../services/forgot-password.services";
import { ForgotPasswordInput } from "../validations/schema/forgot-password.schema";

export class ForgotPasswordController {
  private service: ForgotPasswordService;

  constructor() {
    this.service = new ForgotPasswordService();
  }

  public async handleForgotPassword(input: ForgotPasswordInput) {
    return await this.service.requestPasswordReset(input);
  }
}
