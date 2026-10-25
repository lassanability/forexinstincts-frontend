import Link from "next/link";
import { TbFlask, TbHistory } from "react-icons/tb";
import BacktestForm from "@/app/components/app/BacktestForm";
import Badge from "@/app/components/ui/Badge";
import EmptyState from "@/app/components/ui/EmptyState";
import Panel from "@/app/components/ui/Panel";
import { cx } from "@/app/lib/cx";
import { rValue, shortDate, toneOf } from "@/app/lib/format";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Backtests" };

const STATUS = { running: "cyan", done: "up", failed: "down" };

export default async function BacktestsPage({ searchParams }) {
  const [{ strategy }, strategies, tests] = await Promise.all([searchParams, request("/web/strategies"), request("/web/backtests")]);
  const list = tests.data?.tests ?? [];
  const names = Object.fromEntries((strategies.data ?? []).map((entry) => [entry.key, entry.name]));

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Honest <span className="gradient-text">backtests</span>
          </h1>
          <p>Real Deriv price history, every trade charged spread and commission, and a coin-flip twin with the same stops. If the strategy can’t beat random after costs, you’ll see it here first.</p>
        </div>
        <Badge tone="cyan">
          {tests.data?.used ?? 0} / {tests.data?.limit ?? 0} this month
        </Badge>
      </header>

      <Panel title="New backtest" icon={TbFlask}>
        <BacktestForm strategies={strategies.data ?? []} historyDays={tests.data?.historyDays ?? 30} initialKey={strategy} today={new Date().toISOString().slice(0, 10)} />
      </Panel>

      <Panel title="Your tests" icon={TbHistory} padded={false}>
        {list.length === 0 ? (
          <EmptyState icon={TbFlask} title="No backtests yet" message="Run one above. Results under 200 trades are flagged as mostly luck." />
        ) : (
          <div className={styles.list}>
            {list.map((test) => (
              <Link key={test.id} href={`/backtests/${test.id}`} className={styles.item}>
                <span className={styles.itemIcon}>
                  <TbFlask aria-hidden="true" />
                </span>
                <span className={styles.itemText}>
                  <strong>{names[test.strategy] ?? test.strategy}</strong>
                  <small>
                    {test.symbol.replace("frx", "")} · {shortDate(test.from)} to {shortDate(test.to)}
                  </small>
                </span>
                {test.result && (
                  <span className={styles.right}>
                    <span className={cx("mono", toneOf(test.result.expectancyR))}>{rValue(test.result.expectancyR)}</span>
                    <small className="faint">{test.result.trades} trades</small>
                  </span>
                )}
                <Badge tone={STATUS[test.status]}>{test.status}</Badge>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
