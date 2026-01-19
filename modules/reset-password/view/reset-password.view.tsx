"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, KeyRound, XCircle } from "lucide-react";
import Link from "next/link";
import { ResetPasswordForm } from "../components/form/reset-password.form";

interface ResetPasswordViewProps {
  token?: string;
}

export const ResetPasswordView = ({ token }: ResetPasswordViewProps) => {
  if (!token) {
    return <ErrorState message="Token de recuperación no encontrado" />;
  }

  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold sm:text-2xl">
          Crea tu nueva contraseña
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Ingresa y confirma tu nueva contraseña para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
};

export function SuccessState() {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              ¡Contraseña actualizada!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Tu contraseña ha sido restablecida correctamente. Serás redirigido
              al inicio de sesión.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Ir a iniciar sesión</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Error
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {message}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button asChild variant="outline" className="w-full">
              <Link href="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">Volver al inicio de sesión</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
