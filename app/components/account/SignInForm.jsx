"use client";

import { useActionState } from "react";
import { TbArrowRight, TbMail, TbShieldCheck } from "react-icons/tb";
import { requestCode, verifyCode } from "@/app/actions/auth";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import styles from "@/app/styles/signIn.module.css";

export default function SignInForm({ next }) {
  const [codeState, ask, asking] = useActionState(requestCode, {});
  const [verifyState, verify, verifying] = useActionState(verifyCode, {});
  const email = verifyState.email ?? codeState.email ?? "";
  const sent = codeState.sent || verifyState.sent;

  if (!sent)
    return (
      <form action={ask} className={styles.form}>
        <Field label="Email" error={codeState.error}>
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" defaultValue={email} />
        </Field>
        <Button type="submit" block size="lg" icon={TbMail} loading={asking}>
          Email me a code
        </Button>
        <p className={styles.note}>No password. We send a 6-digit code every time you sign in.</p>
      </form>
    );

  return (
    <div className={styles.form}>
      <form action={verify} className={styles.form}>
        <p className="muted">
          We sent a code to <strong>{email}</strong>.
        </p>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label="6-digit code" error={verifyState.error}>
          <input name="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="••••••" className={`mono ${styles.code}`} autoFocus />
        </Field>
        <Button type="submit" block size="lg" icon={TbShieldCheck} loading={verifying}>
          Sign in
        </Button>
      </form>
      <form action={ask}>
        <input type="hidden" name="email" value={email} />
        <Button type="submit" variant="ghost" size="sm" icon={TbArrowRight} loading={asking}>
          Send a new code
        </Button>
      </form>
    </div>
  );
}
