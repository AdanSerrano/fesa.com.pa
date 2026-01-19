import { useResetPassword } from "../hooks/reset-password.hook";
import { ResetPasswordInput } from "../validations/schema/reset-password.schema";

export function ResetPasswordViewModel(token: string) {
  const { execute, isPending, error, form, success } = useResetPassword(token);

  const handleSubmit = async (values: ResetPasswordInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error, success };
}
