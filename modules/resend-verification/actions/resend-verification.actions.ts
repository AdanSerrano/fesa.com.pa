"use server";

import { ResendVerificationController } from "../controllers/resend-verification.controllers";
import { ResendVerificationInput } from "../validations/schema/resend-verification.schema";

export async function resendVerificationAction(input: ResendVerificationInput) {
  const controller = new ResendVerificationController();
  return await controller.handle(input);
}
