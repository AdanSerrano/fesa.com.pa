"use server";

import { currentUser } from "@/lib/user";
import { SecuritySettingsService } from "../services/security-settings.services";

const securitySettingsService = new SecuritySettingsService();

export async function getSecurityInfoAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autenticado" };
  }

  const securityInfo = await securitySettingsService.getSecurityInfo(user.id);

  if (!securityInfo) {
    return { error: "Error al obtener información de seguridad" };
  }

  return { data: securityInfo };
}

export async function enableTwoFactorAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autenticado" };
  }

  return securitySettingsService.enableTwoFactor(user.id);
}

export async function disableTwoFactorAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autenticado" };
  }

  return securitySettingsService.disableTwoFactor(user.id);
}
