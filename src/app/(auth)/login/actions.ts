"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export type AuthActionResponse = {
	success: boolean;
	message: string;
};

const emailSchema = z.string().email();
const passwordSchema = z.string().min(6);

function getSupabaseActionClient() {
  return createServerActionClient<Database>({ cookies });
}

export async function signInWithGoogle(): Promise<AuthActionResponse> {
	const supabase = getSupabaseActionClient();
	const origin = headers().get("origin") ?? env.NEXT_PUBLIC_SUPABASE_URL;
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${origin}/api/auth/callback`,
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
		},
	});

	if (error) {
		console.error("Google OAuth error", error);
		return {
			success: false,
			message: "No se pudo iniciar sesión con Google.",
		};
	}

	if (data?.url) {
		redirect(data.url);
	}

	return {
		success: true,
		message: "Redirigiendo a Google...",
	};
}

export async function signInWithEmailAction(input: {
	email: string;
	password: string;
}): Promise<AuthActionResponse> {
	const parsedEmail = emailSchema.safeParse(input.email);
	const parsedPassword = passwordSchema.safeParse(input.password);

	if (!parsedEmail.success || !parsedPassword.success) {
		return {
			success: false,
			message: "Credenciales inválidas.",
		};
	}

	const supabase = getSupabaseActionClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: parsedEmail.data,
		password: parsedPassword.data,
	});

	if (error) {
		console.error("Email sign-in error", error);
		return {
			success: false,
			message: error.message ?? "No se pudo iniciar sesión.",
		};
	}

	return {
		success: true,
		message: "Sesión iniciada correctamente.",
	};
}

export async function signUpWithEmailAction(input: {
	email: string;
	password: string;
}): Promise<AuthActionResponse> {
	const parsedEmail = emailSchema.safeParse(input.email);
	const parsedPassword = passwordSchema.safeParse(input.password);

	if (!parsedEmail.success || !parsedPassword.success) {
		return {
			success: false,
			message:
				"Datos inválidos. Usa un correo válido y contraseña de 6+ caracteres.",
		};
	}

	const origin = headers().get("origin") ?? env.NEXT_PUBLIC_SUPABASE_URL;
	const supabase = getSupabaseActionClient();

	const { error } = await supabase.auth.signUp({
		email: parsedEmail.data,
		password: parsedPassword.data,
		options: {
			emailRedirectTo: `${origin}/api/auth/callback`,
		},
	});

	if (error) {
		console.error("Email sign-up error", error);
		return {
			success: false,
			message: error.message ?? "No se pudo registrar el usuario.",
		};
	}

	return {
		success: true,
		message: "Revisa tu correo para completar la verificación.",
	};
}
