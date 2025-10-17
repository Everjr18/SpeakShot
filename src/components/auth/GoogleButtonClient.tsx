"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { AuthActionResponse } from "@/app/(auth)/login/actions";
import { toast } from "@/components/ui/sonner";

type GoogleButtonProps = {
  action: () => Promise<AuthActionResponse>;
};

function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.3 1.6-1.8 4.6-5.1 4.6-3.1 0-5.6-2.6-5.6-5.8s2.5-5.8 5.6-5.8c1.8 0 3 .7 3.7 1.3l2.5-2.4C16.8 4.4 14.6 3.4 12 3.4 6.9 3.4 2.8 7.5 2.8 12.6s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.2-.2-1.6H12z"
      />
    </svg>
  );
}

export default function GoogleButtonClient({ action }: GoogleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await action();
        if (result?.message && !result.success) {
          toast.error(result.message);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          return;
        }
        toast.error("No se pudo iniciar sesión con Google.");
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
      Continuar con Google
    </Button>
  );
}
