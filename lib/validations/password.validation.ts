import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export const passwordStrengthRegex = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'`~]/,
};

export const passwordSchema = z
  .string({
    message: "Contraseña es requerida",
  })
  .min(PASSWORD_MIN_LENGTH, {
    message: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
  })
  .refine((val) => passwordStrengthRegex.hasUppercase.test(val), {
    message: "La contraseña debe contener al menos una mayúscula",
  })
  .refine((val) => passwordStrengthRegex.hasLowercase.test(val), {
    message: "La contraseña debe contener al menos una minúscula",
  })
  .refine((val) => passwordStrengthRegex.hasNumber.test(val), {
    message: "La contraseña debe contener al menos un número",
  })
  .refine((val) => passwordStrengthRegex.hasSpecialChar.test(val), {
    message: "La contraseña debe contener al menos un carácter especial",
  });

export const confirmPasswordSchema = z.string({
  message: "Confirmar contraseña es requerido",
});

export const passwordMatchRefinement = {
  check: (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword,
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"] as string[],
};

export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
  percentage: number;
} => {
  let score = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (password.length >= 12) score++;
  if (passwordStrengthRegex.hasUppercase.test(password)) score++;
  if (passwordStrengthRegex.hasLowercase.test(password)) score++;
  if (passwordStrengthRegex.hasNumber.test(password)) score++;
  if (passwordStrengthRegex.hasSpecialChar.test(password)) score++;

  if (score <= 2) return { score, label: "Débil", color: "bg-red-500", percentage: 33 };
  if (score <= 4) return { score, label: "Media", color: "bg-yellow-500", percentage: 66 };
  return { score, label: "Fuerte", color: "bg-green-500", percentage: 100 };
};
