import { TbLink } from "react-icons/tb";
import BotBuilder from "@/app/components/app/BotBuilder";
import ButtonLink from "@/app/components/ui/ButtonLink";
import EmptyState from "@/app/components/ui/EmptyState";
import { getPreset } from "@/app/lib/api";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "New bot" };

export default async function NewBotPage({ searchParams }) {
  const query = await searchParams;
  const [strategies, accounts, preset] = await Promise.all([request("/web/strategies"), request("/web/accounts"), query.preset ? getPreset(query.preset) : null]);
  const list = strategies.data ?? [];
  const chosen = list.find((strategy) => strategy.key === (preset?.strategy ?? query.strategy) && !strategy.locked);
  const initial = preset ? { strategy: preset.strategy, symbol: preset.symbol, params: preset.params, risk: preset.risk, name: preset.title, presetId: preset.id } : chosen ? { strategy: chosen.key, symbol: chosen.defaultSymbol } : undefined;

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Build a <span className="gradient-text">bot</span>
          </h1>
          <p>Choose a strategy, set the market and the limits that stop it. You start it from the next screen, on demo first.</p>
        </div>
      </header>
      {(accounts.data ?? []).length === 0 ? (
        <EmptyState icon={TbLink} title="Link a Deriv account first" message="Bots trade on your own Deriv account. Linking takes a minute and demo accounts are free." action={<ButtonLink href="/accounts" icon={TbLink}>Link Deriv</ButtonLink>} />
      ) : (
        <BotBuilder strategies={list} accounts={accounts.data} initial={initial} />
      )}
    </>
  );
}
