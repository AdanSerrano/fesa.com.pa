import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("Errors");

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
            <Search className="size-7 text-gray-600 dark:text-gray-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("notFound")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("notFoundDescription")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              {t("goHome")}
            </Link>
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-500">
            {t("contactSupport")}
          </p>
        </div>
      </div>
    </div>
  );
}
