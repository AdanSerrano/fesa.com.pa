"use server";

import { VerifyEmailController } from "../controllers/verify-email.controllers";

export async function verifyEmailAction(token: string) {
  const controller = new VerifyEmailController();
  return await controller.handle({ token });
}
