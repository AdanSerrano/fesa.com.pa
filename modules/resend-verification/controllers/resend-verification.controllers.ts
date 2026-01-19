import { ResendVerificationService } from "../services/resend-verification.services";
import { ResendVerificationInput } from "../validations/schema/resend-verification.schema";

export class ResendVerificationController {
  private service: ResendVerificationService;

  constructor() {
    this.service = new ResendVerificationService();
  }

  public async handle(input: ResendVerificationInput) {
    return await this.service.resend(input);
  }
}
