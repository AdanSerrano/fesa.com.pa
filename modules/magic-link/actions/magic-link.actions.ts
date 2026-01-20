"use server";

import { MagicLinkController } from "../controllers/magic-link.controllers";
import { RequestMagicLinkActionInput } from "../validations/schema/magic-link.schema";

const controller = new MagicLinkController();

export async function requestMagicLinkAction(input: RequestMagicLinkActionInput) {
  return await controller.requestMagicLink({ email: input.email });
}

export async function verifyMagicLinkAction(token: string) {
  return await controller.verifyMagicLink(token);
}
