import { redirect } from "next/navigation";
import SignInForm from "@/app/components/account/SignInForm";
import Logo from "@/app/components/layout/Logo";
import { isSignedIn } from "@/app/lib/session";
import styles from "@/app/styles/signIn.module.css";

export const metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  if (await isSignedIn()) redirect(typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");

  return (
    <div className={styles.shell}>
      <div className={`glass ${styles.card}`}>
        <Logo />
        <h1>
          Welcome to the <span className="gradient-text">terminal</span>
        </h1>
        <p className="muted">Sign in or create your account with just your email.</p>
        <SignInForm next={next} />
      </div>
    </div>
  );
}
