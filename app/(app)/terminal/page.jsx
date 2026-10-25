import { TbLink } from "react-icons/tb";
import Terminal from "@/app/components/app/Terminal";
import ButtonLink from "@/app/components/ui/ButtonLink";
import EmptyState from "@/app/components/ui/EmptyState";
import { getMarkets } from "@/app/lib/api";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Terminal" };

export default async function TerminalPage() {
  const [accounts, markets] = await Promise.all([request("/web/accounts"), getMarkets()]);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Trading <span className="gradient-text">terminal</span>
          </h1>
          <p>Trade by hand on your linked Deriv accounts with live prices. Bots and manual trades share the same kill switch.</p>
        </div>
      </header>
      {(accounts.data ?? []).length === 0 ? <EmptyState icon={TbLink} title="Link a Deriv account to trade" message="The terminal trades on your own Deriv account. Demo accounts are free." action={<ButtonLink href="/accounts" icon={TbLink}>Link Deriv</ButtonLink>} /> : <Terminal accounts={accounts.data} markets={markets ?? []} />}
    </>
  );
}
