"use server";

import { auth } from "@/auth";
import { SecuritySettingsService } from "../services/security-settings.services";

const securitySettingsService = new SecuritySettingsService();

export async function getSecurityInfoAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  const securityInfo = await securitySettingsService.getSecurityInfo(session.user.id);

  if (!securityInfo) {
    return { error: "Error al obtener información de seguridad" };
  }

  return { data: securityInfo };
}

export async function enableTwoFactorAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  return securitySettingsService.enableTwoFactor(session.user.id);
}

export async function disableTwoFactorAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  return securitySettingsService.disableTwoFactor(session.user.id);
}
