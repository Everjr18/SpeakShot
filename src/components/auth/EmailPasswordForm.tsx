import { signInWithEmailAction, signUpWithEmailAction } from "@/app/(auth)/login/actions";
import EmailPasswordFormClient from "./EmailPasswordFormClient";

export default function EmailPasswordForm() {
  return (
    <EmailPasswordFormClient
      signInAction={signInWithEmailAction}
      signUpAction={signUpWithEmailAction}
    />
  );
}
