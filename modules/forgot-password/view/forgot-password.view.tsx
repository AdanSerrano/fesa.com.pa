import { ForgotPasswordForm } from "../components/form/forgot-password.form";

export function ForgotPasswordView() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <ForgotPasswordForm />
    </div>
  );
}
