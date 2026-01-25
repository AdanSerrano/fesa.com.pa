import { Suspense } from "react";
import { VerifyEmailView } from "@/modules/verify-email/view/verify-email.view";
import { VerifyEmailSkeleton } from "@/modules/verify-email/components/verify-email.skeleton";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-md">
        <Suspense fallback={<VerifyEmailSkeleton />}>
          <VerifyEmailView token={token} />
        </Suspense>
      </div>
    </div>
  );
}
