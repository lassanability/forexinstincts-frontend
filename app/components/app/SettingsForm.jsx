"use client";

import { useState, useTransition } from "react";
import { TbBell, TbDeviceFloppy, TbShieldCheck, TbUser } from "react-icons/tb";
import { saveProfile } from "@/app/actions/trading";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import Panel from "@/app/components/ui/Panel";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/botBuilder.module.css";

export default function SettingsForm({ user }) {
  const [name, setName] = useState(user.name ?? "");
  const [notify, setNotify] = useState(user.notify ?? { email: true, trades: false });
  const [subscribed, setSubscribed] = useState(Boolean(user.subscribed));
  const [accepted, setAccepted] = useState(Boolean(user.riskAcceptedAt));
  const [pending, start] = useTransition();

  const save = (extra = {}) =>
    start(async () => {
      const result = await saveProfile({ name, notify, subscribed, ...extra });
      if (result.error) return toast.error(result.error);
      if (extra.acceptRisk) setAccepted(true);
      toast.success("Saved");
    });

  return (
    <div className="stack gap-lg">
      <Panel title="Profile" icon={TbUser}>
        <div className={styles.fields}>
          <Field label="Name">
            <input value={name} maxLength={60} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Email" hint="Sign-in codes go here">
            <input value={user.email} disabled />
          </Field>
        </div>
      </Panel>

      <Panel title="Notifications" icon={TbBell}>
        <div className={styles.fields}>
          <Field label="When a bot stops itself">
            <select value={notify.email ? "on" : "off"} onChange={(event) => setNotify((current) => ({ ...current, email: event.target.value === "on" }))}>
              <option value="on">Email me</option>
              <option value="off">Don’t email me</option>
            </select>
          </Field>
          <Field label="Strategy news and new bots">
            <select value={subscribed ? "on" : "off"} onChange={(event) => setSubscribed(event.target.value === "on")}>
              <option value="on">Send me the newsletter</option>
              <option value="off">No newsletter</option>
            </select>
          </Field>
        </div>
      </Panel>

      <Button icon={TbDeviceFloppy} loading={pending} onClick={() => save()}>
        Save settings
      </Button>

      <Panel title="Risk notice" icon={TbShieldCheck}>
        <div className="stack gap-md">
          <p className="muted">Trading multipliers, options and synthetic indices carries a high risk of losing all the money you trade. Bots follow rules, and rules can lose. Backtests and past results do not guarantee future returns. Synthetic contracts lose a little on average by design.</p>
          {accepted ? <p className="up">You accepted this notice. Bots can start.</p> : <Button variant="glass" icon={TbShieldCheck} loading={pending} onClick={() => save({ acceptRisk: true })}>I understand and accept the risk</Button>}
        </div>
      </Panel>
    </div>
  );
}
