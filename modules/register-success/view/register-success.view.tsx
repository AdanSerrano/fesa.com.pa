import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

export const RegisterSuccessView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                ¡Cuenta creada exitosamente!
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Hemos enviado un correo de verificación a tu dirección de email.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 w-full">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="text-left text-sm">
                  <p className="font-medium">Revisa tu bandeja de entrada</p>
                  <p className="text-muted-foreground mt-1">
                    Haz clic en el enlace de verificación que te enviamos para
                    activar tu cuenta. Si no lo encuentras, revisa tu carpeta de
                    spam.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button asChild className="w-full">
                <Link href="/login">Ir a iniciar sesión</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                ¿No recibiste el correo?{" "}
                <Link
                  href="/resend-verification"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Reenviar correo de verificación
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
