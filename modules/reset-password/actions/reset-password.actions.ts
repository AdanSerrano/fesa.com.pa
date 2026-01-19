"use server";

import { ResetPasswordController } from "../controllers/reset-password.controllers";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";

export async function resetPasswordAction(values: ResetPasswordInput) {
  const controller = new ResetPasswordController();
  return await controller.handleResetPassword(values);
}
