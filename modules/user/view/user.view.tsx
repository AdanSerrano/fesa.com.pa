import { getProfileAction } from "../actions/user.actions";
import { UserProfileClient } from "./user.client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export async function UserProfileView() {
  const result = await getProfileAction();

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  const user = result.data;

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No se pudo cargar el perfil</AlertDescription>
      </Alert>
    );
  }

  return (
    <UserProfileClient
      user={{
        name: user.name,
        userName: user.userName,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        createdAt: user.createdAt,
      }}
    />
  );
}
