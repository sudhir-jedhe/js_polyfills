import { redirect } from "next/navigation";

/** /auth -> always send to the login screen. */
export default function AuthIndex() {
  redirect("/auth/login");
}
