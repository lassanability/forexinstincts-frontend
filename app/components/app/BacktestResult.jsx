"use client";

import { useEffect, useState } from "react";
import { TbAlertTriangle, TbCalendarStats, TbChartLine, TbReceipt } from "react-icons/tb";
import { loadBacktest } from "@/app/actions/trading";
import EquityCurve from "@/app/components/charts/EquityCurve";
import Panel from "@/app/components/ui/Panel";
import Spinner from "@/app/components/ui/Spinner";
import Stat from "@/app/components/ui/Stat";
import { cx } from "@/app/lib/cx";
import { percent, rValue, shortDate, toneOf } from "@/app/lib/format";
import styles from "@/app/styles/appPage.module.css";

const POLL_MS = 3000;

const factor = (value) => (value === null || value === undefined ? "∞" : Number(value).toFixed(2));

export default function BacktestResult({ initial }) {
  const [test, setTest] = useState(initial);

  useEffect(() => {
    if (test.status !== "running") return undefined;
    const timer = setInterval(async () => {
      const result = await loadBacktest(test.id);
      if (result.data) setTest(result.data);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [test.id, test.status]);

  if (test.status === "running")
    return (
      <div className="glass row gap-md">
        <Spinner /> Downloading Deriv history and replaying every candle…
      </div>
    );
  if (test.status === "failed") return <p className="down">The backtest failed: {test.error}</p>;

  const result = test.result;

  return (
    <div className="stack gap-lg">
      {result.warnings.length > 0 && (
        <Panel title="Read this first" icon={TbAlertTriangle}>
          <ul className="stack gap-sm">
            {result.warnings.map((warning) => (
              <li key={warning} className="row gap-sm">
                <TbAlertTriangle className="down" aria-hidden="true" /> {warning}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className={styles.stats}>
        <Stat label="Trades" value={result.trades} note={`${result.skippedByCost} skipped by the cost check`} />
        <Stat label="Average per trade" value={rValue(result.expectancyR)} tone={toneOf(result.expectancyR)} note={`Coin-flip twin ${rValue(result.twin.expectancyR)}`} />
        <Stat label="Edge vs random" value={rValue(result.edgeVsTwinR)} tone={toneOf(result.edgeVsTwinR)} note="Per trade, after costs" />
        <Stat label="Profit factor" value={factor(result.profitFactor)} note={`Win rate ${percent(result.winRate, 0)}`} />
        <Stat label="Return" value={percent(result.returnPercent / 100, 1)} tone={toneOf(result.returnPercent)} note={`At ${result.riskPercent}% risk per trade`} />
        <Stat label="Max drawdown" value={percent(result.maxDrawdownPercent / 100, 1)} tone="down" note={`Without best 5 trades: ${rValue(result.totalWithoutTop5R)}`} />
      </div>

      <div className={styles.columns}>
        <Panel title="Equity" icon={TbChartLine}>
          <EquityCurve points={result.curve} />
        </Panel>
        <Panel title="By year" icon={TbCalendarStats} padded={false}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Year</th>
                <th>Trades</th>
                <th>Total</th>
                <th>PF</th>
              </tr>
            </thead>
            <tbody>
              {result.years.map((year) => (
                <tr key={year.year}>
                  <td className="mono">{year.year}</td>
                  <td className="mono">{year.trades}</td>
                  <td className={cx("mono", toneOf(year.totalR))}>{rValue(year.totalR)}</td>
                  <td className="mono">{factor(year.profitFactor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Last trades" icon={TbReceipt} padded={false}>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Opened</th>
                <th>Side</th>
                <th>Why</th>
                <th>Exit</th>
                <th>Result</th>
                <th>Twin</th>
              </tr>
            </thead>
            <tbody>
              {[...result.lastTrades].reverse().map((trade) => (
                <tr key={`${trade.openedAt}-${trade.entry}`}>
                  <td className="faint">{shortDate(trade.openedAt * 1000)}</td>
                  <td className={trade.side === "buy" ? "up" : "down"}>{trade.side}</td>
                  <td className="truncate">{trade.entryReason}</td>
                  <td className="muted">{trade.reason}</td>
                  <td className={cx("mono", toneOf(trade.r))}>{rValue(trade.r)}</td>
                  <td className={cx("mono", toneOf(trade.twinR))}>{rValue(trade.twinR)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
