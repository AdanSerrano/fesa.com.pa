"use server";

import { RegisterController } from "../controllers/register.controllers";
import { RegisterActionInput } from "../validations/schema/register.schema";

export async function registerAction(values: RegisterActionInput) {
  const registerController = new RegisterController();
  return await registerController.register({
    email: values.email,
    userName: values.userName,
    name: values.name,
    password: values.password,
    confirmPassword: values.confirmPassword,
  });
}
