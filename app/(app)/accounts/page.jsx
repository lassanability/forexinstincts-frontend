import AccountManager from "@/app/components/app/AccountManager";
import { getConfig } from "@/app/lib/api";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Deriv accounts" };

export default async function AccountsPage() {
  const [accounts, config] = await Promise.all([request("/web/accounts"), getConfig()]);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Deriv <span className="gradient-text">accounts</span>
          </h1>
          <p>Your money stays on Deriv. We only hold a trade-only token, so bots can open and close trades but never withdraw.</p>
        </div>
      </header>
      <AccountManager accounts={accounts.data ?? []} derivSignup={config?.links?.derivSignup} />
    </>
  );
}
