import { getProfileAction } from "../actions/user.actions";
import { UserProfileClient } from "./user.client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranslations } from "next-intl/server";

export async function UserProfileView() {
  const [result, t] = await Promise.all([
    getProfileAction(),
    getTranslations("UserProfile"),
  ]);
  const tCommon = await getTranslations("Common");

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{tCommon("error")}</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  const user = result.data;

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{tCommon("error")}</AlertTitle>
        <AlertDescription>{t("couldNotLoadProfile")}</AlertDescription>
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
