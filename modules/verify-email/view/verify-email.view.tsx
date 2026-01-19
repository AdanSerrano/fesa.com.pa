import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { verifyEmailAction } from "../actions/verify-email.actions";

interface VerifyEmailViewProps {
  token?: string;
}

export async function VerifyEmailView({ token }: VerifyEmailViewProps) {
  if (!token) {
    return <ErrorState message="Token de verificación no encontrado" />;
  }

  const result = await verifyEmailAction(token);

  if (result.error) {
    return <ErrorState message={result.error} />;
  }

  return (
    <SuccessState message={result.success || "Email verificado correctamente"} />
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle
              className="h-8 w-8 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
            <span className="sr-only">Verificación exitosa</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              ¡Email verificado!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">{message}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Iniciar sesión</Link>
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
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle
              className="h-8 w-8 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <span className="sr-only">Error de verificación</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Error de verificación
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">{message}</p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button asChild variant="outline" className="w-full">
              <Link href="/resend-verification">
                Solicitar nuevo enlace de verificación
              </Link>
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
