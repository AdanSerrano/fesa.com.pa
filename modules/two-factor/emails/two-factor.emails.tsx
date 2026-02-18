import { render } from "@react-email/components";
import { resend } from "@/utils/resend";
import { TwoFactorCodeEmail } from "../components/emails/two-factor-code.email";

const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@localhost";

export const sendTwoFactorEmail = async (email: string, code: string) => {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Tu código de verificación: ${code}`,
      react: <TwoFactorCodeEmail code={code} />,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Error al enviar el código" };
  }
};
