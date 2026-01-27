import { render } from "@react-email/components";
import { resend } from "@/utils/resend";
import { PasswordResetEmail } from "../components/emails/password-reset.email";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Recupera tu contraseña",
      react: <PasswordResetEmail resetLink={resetLink} />,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: "Error al enviar el correo de recuperación" };
  }
};
