import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { ResetPasswordForm } from "../components/form/reset-password.form";

interface ResetPasswordViewProps {
  token?: string;
}

export function ResetPasswordView({ token }: ResetPasswordViewProps) {
  if (!token) {
    return <ErrorState message="Token de recuperación no encontrado" />;
  }

  return <ResetPasswordForm token={token} />; 
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
