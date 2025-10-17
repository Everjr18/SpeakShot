"use client";

import { useTransition } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type SignOutMenuItemProps = {
  action: () => Promise<void>;
};

export default function SignOutMenuItem({ action }: SignOutMenuItemProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      className="w-full"
      onSelect={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await action();
        });
      }}
    >
      {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
    </DropdownMenuItem>
  );
}
