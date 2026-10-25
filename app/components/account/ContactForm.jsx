"use client";

import { useActionState } from "react";
import { TbSend } from "react-icons/tb";
import { sendContact } from "@/app/actions/auth";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import styles from "@/app/styles/signIn.module.css";

export default function ContactForm() {
  const [state, send, sending] = useActionState(sendContact, {});

  if (state.sent) return <p className="up">Thanks, your message is on its way. We reply by email, usually within a day.</p>;

  return (
    <form action={send} className={styles.form}>
      <Field label="Name">
        <input name="name" required maxLength={80} autoComplete="name" />
      </Field>
      <Field label="Email">
        <input type="email" name="email" required autoComplete="email" />
      </Field>
      <Field label="Subject">
        <input name="subject" required maxLength={120} />
      </Field>
      <Field label="Message" error={state.error}>
        <textarea name="message" required maxLength={4000} />
      </Field>
      <Button type="submit" icon={TbSend} loading={sending}>
        Send message
      </Button>
    </form>
  );
}
