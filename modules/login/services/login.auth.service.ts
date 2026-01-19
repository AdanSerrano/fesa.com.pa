import { signIn } from "@/auth";
import { AuthError, CredentialsSignin } from "next-auth";

export interface AuthResult {
  success?: string;
  error?: string;
  redirect?: boolean;
}

export class LoginAuthService {
  public async authenticateUser(
    identifier: string,
    password: string
  ): Promise<AuthResult> {
    try {
      await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      return { success: "Login Realizado Correctamente", redirect: true };
    } catch (error) {
      if (error instanceof CredentialsSignin) {
        return { error: "Credenciales incorrectas" };
      }

      if (error instanceof AuthError) {
        return { error: "Error de autenticación" };
      }

      const errorMessage = (error as Error).message;
      if (errorMessage?.includes("NEXT_REDIRECT")) {
        return { success: "Login Realizado Correctamente", redirect: true };
      }

      return { error: "Error al iniciar sesión" };
    }
  }
}
