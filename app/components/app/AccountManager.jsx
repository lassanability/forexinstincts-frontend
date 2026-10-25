"use client";

import { useState, useTransition } from "react";
import { TbKey, TbLink, TbRefresh, TbTrash, TbWallet } from "react-icons/tb";
import { linkAccount, refreshAccounts, removeAccount } from "@/app/actions/trading";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import EmptyState from "@/app/components/ui/EmptyState";
import Field from "@/app/components/ui/Field";
import Panel from "@/app/components/ui/Panel";
import { money } from "@/app/lib/format";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/appPage.module.css";

export default function AccountManager({ accounts, derivSignup }) {
  const [token, setToken] = useState("");
  const [pending, start] = useTransition();

  const run = (work, after) =>
    start(async () => {
      const result = await work();
      if (result.error) return toast.error(result.error);
      toast.success(result.message ?? "Done");
      after?.();
    });

  return (
    <div className={styles.columns}>
      <Panel title="Linked accounts" icon={TbWallet} padded={false} actions={<Button size="sm" variant="ghost" icon={TbRefresh} loading={pending} onClick={() => run(refreshAccounts)}>Refresh balances</Button>}>
        {accounts.length === 0 ? (
          <EmptyState icon={TbWallet} title="No Deriv account linked yet" message="Link one with a trade-only token to start running bots. Demo accounts are free on every plan." />
        ) : (
          <div className={styles.list}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.item}>
                <span className={styles.itemIcon}>
                  <TbWallet aria-hidden="true" />
                </span>
                <span className={styles.itemText}>
                  <strong className="mono">{account.derivId}</strong>
                  <small>{account.lastError ? `Connection problem: ${account.lastError}` : `Linked ${new Date(account.createdAt).toLocaleDateString("en-GB")}`}</small>
                </span>
                <Badge tone={account.isVirtual ? "cyan" : "warn"}>{account.isVirtual ? "Demo" : "Real"}</Badge>
                <span className={`mono ${styles.right}`}>{account.balance === null ? "—" : money(account.balance, account.currency)}</span>
                <Button size="sm" variant="ghost" icon={TbTrash} aria-label={`Unlink ${account.derivId}`} onClick={() => run(() => removeAccount(account.id))} />
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Link a Deriv account" icon={TbKey}>
        <ol className="stack gap-md">
          <li>
            1. Sign in to Deriv{derivSignup && (
              <>
                {" "}
                (or <a href={derivSignup} target="_blank" rel="noreferrer" className="up">open a free account</a>)
              </>
            )}{" "}
            and open <span className={styles.code}>Account settings → API token</span>.
          </li>
          <li>
            2. Create a token with only the <span className={styles.code}>Trade</span> scope. Leave Payments and Admin unticked so it can never move money.
          </li>
          <li>3. Paste it below. Every demo and real account under that login is linked at once.</li>
        </ol>
        <form
          className="stack gap-md"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => linkAccount(token), () => setToken(""));
          }}
        >
          <Field label="API token" hint="Stored encrypted. Delete it on Deriv any time to cut access instantly.">
            <input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" required minLength={8} className="mono" />
          </Field>
          <Button type="submit" icon={TbLink} loading={pending}>
            Link account
          </Button>
        </form>
      </Panel>
    </div>
  );
}
