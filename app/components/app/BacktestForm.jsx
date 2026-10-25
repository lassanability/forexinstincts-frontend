"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TbFlask } from "react-icons/tb";
import { runBacktest } from "@/app/actions/trading";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/botBuilder.module.css";

const DAY_MS = 86400000;
const isoDay = (time) => new Date(time).toISOString().slice(0, 10);
const shift = (day, days) => isoDay(Date.parse(day) + days * DAY_MS);

export default function BacktestForm({ strategies, historyDays, initialKey, today }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const usable = strategies.filter((strategy) => strategy.market === "forex" && !strategy.locked);
  const [key, setKey] = useState(usable.some((strategy) => strategy.key === initialKey) ? initialKey : usable[0]?.key);
  const strategy = usable.find((entry) => entry.key === key);
  const [symbol, setSymbol] = useState(strategy?.defaultSymbol);
  const [from, setFrom] = useState(shift(today, -Math.min(historyDays, 90)));
  const [to, setTo] = useState(today);
  const [riskPercent, setRiskPercent] = useState(0.5);
  const [spread, setSpread] = useState("");
  const [commission, setCommission] = useState("");

  if (!strategy) return <p className="muted">Your plan has no forex strategies to test yet.</p>;

  const submit = (event) => {
    event.preventDefault();
    start(async () => {
      const result = await runBacktest({ strategy: key, symbol, from, to, riskPercent, costs: { ...(spread !== "" && { spread: Number(spread) }), ...(commission !== "" && { commission: Number(commission) / 100 }) } });
      if (result.error) return toast.error(result.error);
      toast.success("Backtest started. Results usually take under a minute.");
      router.push(`/backtests/${result.data.id}`);
    });
  };

  return (
    <form onSubmit={submit} className="stack gap-lg">
      <div className={styles.fields}>
        <Field label="Strategy">
          <select
            value={key}
            onChange={(event) => {
              const next = usable.find((entry) => entry.key === event.target.value);
              setKey(next.key);
              setSymbol(next.defaultSymbol);
            }}
          >
            {usable.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Market">
          <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
            {strategy.symbols.map((entry) => (
              <option key={entry} value={entry}>
                {entry.replace("frx", "")}
              </option>
            ))}
          </select>
        </Field>
        <Field label="From" hint={`Your plan reaches back ${historyDays} days`}>
          <input type="date" value={from} min={shift(today, -historyDays)} max={to} onChange={(event) => setFrom(event.target.value)} />
        </Field>
        <Field label="To">
          <input type="date" value={to} min={from} max={today} onChange={(event) => setTo(event.target.value)} />
        </Field>
        <Field label="Risk per trade (%)">
          <input type="number" value={riskPercent} min={0.1} max={5} step={0.1} onChange={(event) => setRiskPercent(Number(event.target.value))} />
        </Field>
        <Field label="Spread (price units)" hint="Blank uses our estimate for this market">
          <input type="number" value={spread} min={0} step="any" placeholder="Estimate" onChange={(event) => setSpread(event.target.value)} />
        </Field>
        <Field label="Commission (% of position)" hint="Blank uses 0.01%">
          <input type="number" value={commission} min={0} step="any" placeholder="0.01" onChange={(event) => setCommission(event.target.value)} />
        </Field>
      </div>
      <Button type="submit" icon={TbFlask} loading={pending}>
        Run backtest
      </Button>
    </form>
  );
}
