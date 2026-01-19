"use server";

import { ForgotPasswordController } from "../controllers/forgot-password.controllers";
import { ForgotPasswordInput } from "../validations/schema/forgot-password.schema";

export async function forgotPasswordAction(values: ForgotPasswordInput) {
  const controller = new ForgotPasswordController();
  return await controller.handleForgotPassword(values);
}
