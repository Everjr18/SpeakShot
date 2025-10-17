import GoogleButtonClient from "./GoogleButtonClient";
import { signInWithGoogle } from "@/app/(auth)/login/actions";

export default function GoogleButton() {
  return <GoogleButtonClient action={signInWithGoogle} />;
}
