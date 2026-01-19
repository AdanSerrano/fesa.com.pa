import { z } from "zod";
import {
  passwordSchema,
  confirmPasswordSchema,
  passwordMatchRefinement,
} from "@/lib/validations/password.validation";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    token: z.string().min(1, "Token requerido"),
  })
  .refine(passwordMatchRefinement.check, {
    message: passwordMatchRefinement.message,
    path: passwordMatchRefinement.path,
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const tokenSchema = z.object({
  token: z.string().min(1, "Token requerido"),
});

export type TokenInput = z.infer<typeof tokenSchema>;
