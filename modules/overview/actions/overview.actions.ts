"use server";

import { OverviewController } from "../controllers/overview.controllers";

export async function getUserSessionAction() {
  const controller = new OverviewController();
  return await controller.handleGetUserSession();
}
