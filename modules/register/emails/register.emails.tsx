import { render } from "@react-email/components";
import { resend } from "@/utils/resend";
import { VerificationEmail } from "../components/emails/verification.email";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  try {
    const html = await render(<VerificationEmail confirmLink={confirmLink} />);

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Confirma tu correo electrónico",
      react: <VerificationEmail confirmLink={confirmLink} />,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al enviar el correo de verificación" };
  }
};
