import { z } from "zod";

// Schema para actualizar perfil básico
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .optional(),
  userName: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder 30 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Solo letras, números, guiones y guiones bajos"
    )
    .optional()
    .or(z.literal("")),
  image: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Schema para actualizar email
export const updateEmailSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electrónico inválido"),
  currentPassword: z
    .string()
    .min(1, "La contraseña actual es requerida"),
});

export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;

// Schema para actualizar contraseña
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

// Schema para eliminar cuenta
export const deleteAccountSchema = z
  .object({
    password: z
      .string()
      .min(1, "La contraseña es requerida para eliminar tu cuenta"),
    confirmation: z.string().min(1, "Escribe ELIMINAR para confirmar"),
  })
  .refine((data) => data.confirmation === "ELIMINAR", {
    message: "Escribe ELIMINAR para confirmar",
    path: ["confirmation"],
  });

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
