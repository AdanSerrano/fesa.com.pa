import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "../components/form/register.form";

export const RegisterView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-bold sm:text-2xl">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Regístrate para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};
