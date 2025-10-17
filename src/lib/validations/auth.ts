import { z } from "zod";

export const emailSchema = z.string().email("Introduce un correo válido.");
export const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const magicLinkSchema = z.object({
  email: emailSchema,
});
