import { z } from "zod";

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, "Email requerido")
    .email("Email inválido"),
});

export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
