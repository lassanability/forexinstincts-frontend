import { TbCreditCard, TbSparkles } from "react-icons/tb";
import SettingsForm from "@/app/components/app/SettingsForm";
import ButtonLink from "@/app/components/ui/ButtonLink";
import Panel from "@/app/components/ui/Panel";
import { longDate, money } from "@/app/lib/format";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [me, billing] = await Promise.all([request("/auth/me"), request("/web/payments/history")]);
  const access = me.data.access;
  const orders = billing.data?.orders ?? [];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Account <span className="gradient-text">settings</span>
          </h1>
        </div>
      </header>

      <div className={styles.columns}>
        <SettingsForm user={me.data} />
        <div className="stack gap-lg">
          <Panel title="Your plan" icon={TbSparkles}>
            <div className="stack gap-md">
              <strong className={`gradient-text ${styles.code}`}>{access.tier}</strong>
              <p className="muted">
                {access.limits.bots} bots at once · {access.limits.backtests} backtests a month · {access.limits.historyDays} days of history · {access.limits.realAccounts ? "real and demo accounts" : "demo accounts only"}
              </p>
              {access.expiresAt && <p className="muted">Active until {longDate(access.expiresAt)}. Manage or cancel renewal in your Whop account.</p>}
              <ButtonLink href="/plans" variant="glass">
                {access.tier === "free" ? "See paid plans" : "Change plan"}
              </ButtonLink>
            </div>
          </Panel>
          <Panel title="Payments" icon={TbCreditCard} padded={false}>
            {orders.length === 0 ? (
              <p className={`muted ${styles.item}`}>No payments yet.</p>
            ) : (
              <table className={styles.table}>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.reference}>
                      <td>{longDate(order.paidAt)}</td>
                      <td className="mono">{order.plan}</td>
                      <td className="mono">{money(order.amount, order.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
