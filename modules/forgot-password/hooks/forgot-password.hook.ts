"use client";

import { forgotPasswordAction } from "../actions/forgot-password.actions";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "../validations/schema/forgot-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useForgotPassword = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const execute = async (values: ForgotPasswordInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(values);
        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }
        toast.success(result.success);
        setSent(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return { execute, isPending, error, form, sent };
};
