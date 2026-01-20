"use server";

import { auth } from "@/auth";
import { UserController } from "../controllers/user.controllers";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

const controller = new UserController();

export async function getProfileAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.getProfile(session.user.id);
}

export async function updateProfileAction(input: UpdateProfileInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updateProfile(session.user.id, input);
}

export async function updateEmailAction(input: UpdateEmailInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updateEmail(session.user.id, input);
}

export async function updatePasswordAction(input: UpdatePasswordInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updatePassword(session.user.id, input);
}

export async function scheduleAccountDeletionAction(input: DeleteAccountInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.scheduleAccountDeletion(session.user.id, input);
}

export async function cancelAccountDeletionAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.cancelAccountDeletion(session.user.id);
}

export async function getDeletionStatusAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.getDeletionStatus(session.user.id);
}

export async function checkDeletionStatusByEmailAction(email: string) {
  return await controller.getDeletionStatusByEmail(email);
}

export async function reactivateAccountAction(email: string) {
  return await controller.reactivateAccountByEmail(email);
}
