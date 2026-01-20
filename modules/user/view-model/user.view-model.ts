"use client";

import {
  useProfileForm,
  useEmailForm,
  usePasswordForm,
  useDeleteAccountForm,
  UseProfileFormProps,
} from "../hooks/user.hook";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

export function ProfileViewModel(props: UseProfileFormProps = {}) {
  const { execute, isPending, error, form } = useProfileForm(props);

  const handleSubmit = async (values: UpdateProfileInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error };
}

export function EmailViewModel() {
  const { execute, isPending, error, form } = useEmailForm();

  const handleSubmit = async (values: UpdateEmailInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error };
}

export function PasswordViewModel() {
  const { execute, isPending, error, form } = usePasswordForm();

  const handleSubmit = async (values: UpdatePasswordInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error };
}

export function DeleteAccountViewModel() {
  const { execute, isPending, error, form } = useDeleteAccountForm();

  const handleSubmit = async (values: DeleteAccountInput) => {
    await execute(values);
  };

  return { handleSubmit, form, isPending, error };
}
