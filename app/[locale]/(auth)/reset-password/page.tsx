import { Suspense } from "react";
import { ResetPasswordView } from "@/modules/reset-password/view/reset-password.view";
import { ResetPasswordSkeleton } from "@/modules/reset-password/components/reset-password.skeleton";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-md">
        <Suspense fallback={<ResetPasswordSkeleton />}>
          <ResetPasswordView token={token} />
        </Suspense>
      </div>
    </div>
  );
}
