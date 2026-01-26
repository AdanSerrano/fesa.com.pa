import { listR2ObjectsAction } from "../actions/file-manager.actions";
import { FileManagerClient } from "./file-manager.client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranslations } from "next-intl/server";

interface FileManagerViewProps {
  searchParams?: {
    path?: string;
  };
}

export async function FileManagerView({ searchParams }: FileManagerViewProps) {
  const t = await getTranslations("FileManager");
  const tCommon = await getTranslations("Common");

  const path = searchParams?.path || "";

  const result = await listR2ObjectsAction(path);

  if (result.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{tCommon("error")}</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  if (!result.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{tCommon("error")}</AlertTitle>
        <AlertDescription>{t("loadError")}</AlertDescription>
      </Alert>
    );
  }

  return <FileManagerClient initialData={result.data} initialPath={path} />;
}
