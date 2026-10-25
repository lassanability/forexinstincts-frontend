import { redirect } from "next/navigation";
import AppShell from "@/app/components/app/AppShell";
import { isSignedIn, request } from "@/app/lib/session";

export const metadata = { robots: { index: false } };

export default async function AppLayout({ children }) {
  if (!(await isSignedIn())) redirect("/login");

  const me = await request("/auth/me");
  if (!me.ok) redirect("/login");

  return <AppShell user={me.data}>{children}</AppShell>;
}
