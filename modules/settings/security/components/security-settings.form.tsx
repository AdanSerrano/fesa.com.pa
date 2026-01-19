"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Activity,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SecuritySettingsViewModel } from "../view-model/security-settings.view-model";
import { SecuritySettingsSkeleton } from "./security-settings.skeleton";

const ACTION_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: "Inicio de sesión",
  LOGIN_FAILED: "Intento fallido",
  LOGOUT: "Cierre de sesión",
  PASSWORD_RESET_REQUESTED: "Reseteo solicitado",
  PASSWORD_RESET_COMPLETED: "Contraseña cambiada",
  EMAIL_VERIFIED: "Email verificado",
  TWO_FACTOR_ENABLED: "2FA activado",
  TWO_FACTOR_DISABLED: "2FA desactivado",
  TWO_FACTOR_VERIFIED: "2FA verificado",
  ACCOUNT_LOCKED: "Cuenta bloqueada",
  ACCOUNT_UNLOCKED: "Cuenta desbloqueada",
  REGISTRATION: "Registro",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${days}d`;
}

export const SecuritySettingsForm = memo(function SecuritySettingsForm() {
  const {
    securityInfo,
    isLoading,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  } = SecuritySettingsViewModel();

  if (isLoading) {
    return <SecuritySettingsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <p className="text-destructive text-center">{error}</p>
          <Button variant="outline" onClick={refreshSecurityInfo}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!securityInfo) {
    return null;
  }

  const isTwoFactorEnabled = securityInfo.isTwoFactorEnabled;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Autenticación de dos factores</CardTitle>
          </div>
          <CardDescription>
            Agrega una capa adicional de seguridad a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              {isTwoFactorEnabled ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <ShieldOff className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Verificación por email</p>
                  {isTwoFactorEnabled ? (
                    <Badge variant="default" className="bg-green-500">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isTwoFactorEnabled
                    ? `Recibirás un código en ${securityInfo.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")} al iniciar sesión`
                    : "Te enviaremos un código de verificación al iniciar sesión"}
                </p>
              </div>
            </div>

            {isTwoFactorEnabled ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldOff className="mr-2 h-4 w-4" />
                    )}
                    Desactivar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Desactivar 2FA?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tu cuenta será menos segura sin la autenticación de dos
                      factores. ¿Estás seguro de que deseas continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisableTwoFactor}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Desactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleEnableTwoFactor} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Activar
              </Button>
            )}
          </div>

          {securityInfo.lockedUntil && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Tu cuenta está bloqueada hasta{" "}
                {formatDate(securityInfo.lockedUntil)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Actividad reciente</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshSecurityInfo}
              disabled={isPending}
            >
              <RefreshCw
                className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <CardDescription>
            Últimos eventos de seguridad en tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityInfo.recentActivity.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No hay actividad reciente
            </p>
          ) : (
            <div className="space-y-1">
              {securityInfo.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.action.includes("FAILED") ||
                        activity.action.includes("LOCKED")
                          ? "bg-destructive"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {ACTION_LABELS[activity.action] || activity.action}
                      </p>
                      {activity.ipAddress && (
                        <p className="text-xs text-muted-foreground">
                          IP: {activity.ipAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
