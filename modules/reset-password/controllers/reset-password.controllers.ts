import { ResetPasswordService } from "../services/reset-password.services";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";

export class ResetPasswordController {
  private service: ResetPasswordService;

  constructor() {
    this.service = new ResetPasswordService();
  }

  public async handleResetPassword(input: ResetPasswordInput) {
    return await this.service.resetPassword(input);
  }
}
