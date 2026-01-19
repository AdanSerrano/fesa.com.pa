"use client";

import { resendVerificationAction } from "../actions/resend-verification.actions";
import {
  resendVerificationSchema,
  ResendVerificationInput,
} from "../validations/schema/resend-verification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useResendVerification = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const form = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResend = async (values: ResendVerificationInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await resendVerificationAction(values);

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        toast.success(result.success);
        setSent(true);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error inesperado";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return { handleResend, isPending, error, form, sent };
};
