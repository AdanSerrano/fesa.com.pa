"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";

import {
  updateProfileAction,
  updateEmailAction,
  updatePasswordAction,
  scheduleAccountDeletionAction,
} from "../actions/user.actions";
import {
  updateProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
  deleteAccountSchema,
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

export interface UseProfileFormProps {
  defaultValues?: Partial<UpdateProfileInput>;
}

export const useProfileForm = ({ defaultValues }: UseProfileFormProps = {}) => {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      userName: defaultValues?.userName ?? "",
      image: defaultValues?.image ?? "",
    },
  });

  const execute = useCallback(
    async (values: UpdateProfileInput) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await updateProfileAction(values);

          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }

          toast.success(result.success);
          await updateSession();
          router.refresh();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error inesperado";
          setError(message);
          toast.error(message);
        }
      });
    },
    [router, updateSession]
  );

  return { execute, isPending, error, form };
};

export const useEmailForm = () => {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateEmailInput>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
    },
  });

  const execute = useCallback(
    async (values: UpdateEmailInput) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await updateEmailAction(values);

          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }

          toast.success(result.success);
          form.reset();
          await updateSession();
          router.refresh();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error inesperado";
          setError(message);
          toast.error(message);
        }
      });
    },
    [router, form, updateSession]
  );

  return { execute, isPending, error, form };
};

export const usePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const execute = useCallback(
    async (values: UpdatePasswordInput) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await updatePasswordAction(values);

          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }

          toast.success(result.success);
          form.reset();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Error inesperado";
          setError(message);
          toast.error(message);
        }
      });
    },
    [form]
  );

  return { execute, isPending, error, form };
};

export const useDeleteAccountForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DeleteAccountInput>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
  });

  const execute = useCallback(async (values: DeleteAccountInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await scheduleAccountDeletionAction(values);

        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(result.success);

        if (result.requiresLogout) {
          await signOut({ callbackUrl: "/login" });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error inesperado";
        setError(message);
        toast.error(message);
      }
    });
  }, []);

  return { execute, isPending, error, form };
};
