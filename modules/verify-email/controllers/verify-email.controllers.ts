import { VerifyEmailService } from "../services/verify-email.services";
import { VerifyEmailInput } from "../validations/schema/verify-email.schema";

export class VerifyEmailController {
  private service: VerifyEmailService;

  constructor() {
    this.service = new VerifyEmailService();
  }

  public async handle(input: VerifyEmailInput) {
    return await this.service.verify(input);
  }
}
