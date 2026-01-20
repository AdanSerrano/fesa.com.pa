"use client";

import { registerAction } from "@/modules/register/actions/register.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  RegisterUser,
  RegisterActionInput,
  createRegisterFormSchema,
} from "../validations/schema/register.schema";

export const useRegister = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterUser>({
    resolver: zodResolver(createRegisterFormSchema),
    defaultValues: {
      email: "",
      userName: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register = useCallback(
    async (values: RegisterUser) => {
      setError(null);

      startTransition(async () => {
        try {
          const actionInput: RegisterActionInput = {
            ...values,
          };

          const result = await registerAction(actionInput);

          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }
          if (result?.success) {
            toast.success(result.success);
            router.push("/register-success");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al registrar usuario";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return {
    register,
    isPending,
    error,
    form,
  };
};
