import { notFound } from "next/navigation";
import BacktestResult from "@/app/components/app/BacktestResult";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { shortDate } from "@/app/lib/format";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Backtest result" };

export default async function BacktestPage({ params }) {
  const { id } = await params;
  const [test, strategies] = await Promise.all([request(`/web/backtests/${id}`), request("/web/strategies")]);
  if (!test.ok) notFound();

  const strategy = (strategies.data ?? []).find((entry) => entry.key === test.data.strategy);

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>{strategy?.name ?? test.data.strategy}</h1>
          <p>
            {test.data.symbol.replace("frx", "")} · {shortDate(test.data.from)} to {shortDate(test.data.to)} · spread {test.data.costs.spread}, commission {(test.data.costs.commission * 100).toFixed(3)}%
          </p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={`/bots/new?strategy=${test.data.strategy}`}>Build this bot</ButtonLink>
        </div>
      </header>
      <BacktestResult initial={test.data} />
    </>
  );
}
