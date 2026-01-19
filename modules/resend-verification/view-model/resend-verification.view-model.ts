import { useResendVerification } from "../hooks/resend-verification.hook";
import { ResendVerificationInput } from "../validations/schema/resend-verification.schema";

export function ResendVerificationViewModel() {
  const { handleResend, isPending, error, form, sent } = useResendVerification();

  const handleSubmit = async (values: ResendVerificationInput) => {
    await handleResend(values);
  };

  return { handleSubmit, form, isPending, error, sent };
}
