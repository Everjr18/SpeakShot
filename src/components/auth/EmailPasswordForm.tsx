import type { AuthActionResponse } from "@/app/(auth)/login/actions";
import {
  sendMagicLinkAction,
  signInWithEmailAction,
  signUpWithEmailAction,
} from "@/app/(auth)/login/actions";
import EmailPasswordFormClient from "./EmailPasswordFormClient";

type EmailPasswordFormProps = {
  enableMagicLink: boolean;
};

export default function EmailPasswordForm({
  enableMagicLink,
}: EmailPasswordFormProps) {
  return (
    <EmailPasswordFormClient
      enableMagicLink={enableMagicLink}
      signInAction={signInWithEmailAction}
      signUpAction={signUpWithEmailAction}
      magicLinkAction={sendMagicLinkAction}
    />
  );
}

export type { AuthActionResponse };
