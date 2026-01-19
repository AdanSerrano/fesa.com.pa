"use server";

import { ServicesController } from "../controllers/services.controllers";

export async function getUserSessionAction() {
  const controller = new ServicesController();
  return await controller.handleGetUserSession();
}
