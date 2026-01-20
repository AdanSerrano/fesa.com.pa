"use server";

import { LoginController } from "../controllers/login.controllers";
import { LoginActionInput } from "../validations/schema/login.schema";

export async function loginAction(values: LoginActionInput) {
  const loginController = new LoginController();
  return await loginController.handleLogin({
    identifier: values.identifier,
    password: values.password,
  });
}
