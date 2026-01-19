"use client";

import { resetPasswordAction } from "../actions/reset-password.actions";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "../validations/schema/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useResetPassword = (token: string) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token,
    },
  });

  const execute = async (values: ResetPasswordInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await resetPasswordAction(values);
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }
        toast.success(result.success);
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return { execute, isPending, error, form, success };
};
