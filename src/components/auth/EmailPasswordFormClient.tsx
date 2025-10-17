"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  magicLinkSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import type { AuthActionResponse } from "./EmailPasswordForm";

type EmailPasswordFormClientProps = {
  enableMagicLink: boolean;
  signInAction: (values: SignInValues) => Promise<AuthActionResponse>;
  signUpAction: (values: SignInValues) => Promise<AuthActionResponse>;
  magicLinkAction: (values: MagicLinkValues) => Promise<AuthActionResponse>;
};

type SignInValues = {
  email: string;
  password: string;
};

type MagicLinkValues = {
  email: string;
};

export default function EmailPasswordFormClient({
  enableMagicLink,
  signInAction,
  signUpAction,
  magicLinkAction,
}: EmailPasswordFormClientProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "magic">("signin");

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      className="space-y-4"
    >
      <TabsList className={`grid w-full ${enableMagicLink ? "grid-cols-3" : "grid-cols-2"}`}>
        <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
        <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
        {enableMagicLink && <TabsTrigger value="magic">Magic link</TabsTrigger>}
      </TabsList>

      <TabsContent value="signin">
        <PasswordForm
          mode="signin"
          action={signInAction}
          successMessage="Sesión iniciada correctamente."
        />
      </TabsContent>

      <TabsContent value="signup">
        <PasswordForm
          mode="signup"
          action={signUpAction}
          successMessage="Usuario creado. Revisa tu correo para verificar la cuenta."
        />
      </TabsContent>

      {enableMagicLink && (
        <TabsContent value="magic">
          <MagicLinkForm action={magicLinkAction} />
        </TabsContent>
      )}
    </Tabs>
  );
}

type PasswordFormProps = {
  mode: "signin" | "signup";
  action: (values: SignInValues) => Promise<AuthActionResponse>;
  successMessage: string;
};

function PasswordForm({ mode, action, successMessage }: PasswordFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInValues>({
    resolver: zodResolver(mode === "signin" ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SignInValues) => {
    startTransition(async () => {
      const response = await action(values);
      if (response.success) {
        toast.success(successMessage);
        form.reset();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••"
                    className="pl-9"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : mode === "signin" ? (
            "Iniciar sesión"
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </form>
    </Form>
  );
}

type MagicLinkFormProps = {
  action: (values: MagicLinkValues) => Promise<AuthActionResponse>;
};

function MagicLinkForm({ action }: MagicLinkFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MagicLinkValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: MagicLinkValues) => {
    startTransition(async () => {
      const response = await action(values);
      if (response.success) {
        toast.success(response.message);
        form.reset();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando magic link...
            </>
          ) : (
            "Enviar magic link"
          )}
        </Button>
      </form>
    </Form>
  );
}
