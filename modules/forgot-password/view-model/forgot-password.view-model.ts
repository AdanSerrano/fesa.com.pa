import { useForgotPassword } from "../hooks/forgot-password.hook";
import { ForgotPasswordInput } from "../validations/schema/forgot-password.schema";

export function ForgotPasswordViewModel() {
  const { execute, isPending, error, form, sent } = useForgotPassword();

  const handleSubmit = async (values: ForgotPasswordInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error, sent };
}
