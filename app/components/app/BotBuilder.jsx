"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TbAdjustments, TbAlertTriangle, TbDeviceFloppy, TbLock, TbShieldCheck, TbTarget } from "react-icons/tb";
import { previewBot, saveBot } from "@/app/actions/trading";
import EvidenceBadge from "@/app/components/strategies/EvidenceBadge";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import Panel from "@/app/components/ui/Panel";
import { cx } from "@/app/lib/cx";
import { money, percent } from "@/app/lib/format";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/botBuilder.module.css";

const PREVIEW_DELAY_MS = 500;

const FOREX_RISK = [
  ["riskPercent", "Risk per trade (% of balance)", 0.5, 0.1, 5, 0.1],
  ["maxStake", "Largest stake per trade", 50, 1, 10000, 1],
  ["maxDailyLoss", "Stop for the day after losing", 25, 1, 100000, 1],
  ["maxWeeklyLoss", "Stop for the week after losing", "", 1, 100000, 1],
  ["dailyTarget", "Rest for the day after winning", "", 1, 100000, 1],
  ["maxLossStreak", "Stop after losses in a row", 5, 1, 50, 1],
  ["maxDrawdownPercent", "Stop at drawdown (% of start balance)", 10, 1, 50, 1],
  ["maxOpenTrades", "Open trades at once", 1, 1, 10, 1],
];

const SYNTHETIC_RISK = [
  ["stake", "Stake per trade", 1, 0.35, 1000, 0.01],
  ["maxStake", "Largest stake ever", 5, 0.35, 10000, 0.01],
  ["maxDailyLoss", "Stop for the day after losing", 20, 1, 100000, 1],
  ["dailyTarget", "Rest for the day after winning", "", 1, 100000, 1],
  ["maxLossStreak", "Stop after losses in a row", 6, 1, 50, 1],
  ["maxDrawdownPercent", "Stop at drawdown (% of start balance)", 10, 1, 50, 1],
];

const defaultsOf = (strategy) => Object.fromEntries(strategy.params.map((param) => [param.key, param.default]));

const riskDefaults = (market) => Object.fromEntries((market === "forex" ? FOREX_RISK : SYNTHETIC_RISK).map(([key, , value]) => [key, value]));

export default function BotBuilder({ strategies, accounts, initial }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [strategyKey, setStrategyKey] = useState(initial?.strategy ?? strategies.find((strategy) => !strategy.locked)?.key);
  const strategy = strategies.find((entry) => entry.key === strategyKey);
  const [symbol, setSymbol] = useState(initial?.symbol ?? strategy.defaultSymbol);
  const [accountId, setAccountId] = useState(initial?.accountId ?? accounts.find((account) => account.isVirtual)?.id ?? accounts[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [params, setParams] = useState({ ...defaultsOf(strategy), ...(initial?.params ?? {}) });
  const [risk, setRisk] = useState({ ...riskDefaults(strategy.market), recovery: "flat", recoveryFactor: 2, recoveryLevels: 3, ...(initial?.risk ?? {}) });
  const [preview, setPreview] = useState(null);

  const choose = (next) => {
    setStrategyKey(next.key);
    setSymbol(next.defaultSymbol);
    setParams(defaultsOf(next));
    setRisk({ ...riskDefaults(next.market), recovery: "flat", recoveryFactor: 2, recoveryLevels: 3 });
    setPreview(null);
  };

  const body = useMemo(() => ({ strategy: strategyKey, symbol, params, risk }), [strategyKey, symbol, params, risk]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await previewBot(body);
      if (!result.error) setPreview(result.data);
    }, PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [body]);

  const save = () =>
    start(async () => {
      const result = await saveBot(initial?.id, { ...body, name: name || strategy.name, accountId, presetId: initial?.presetId });
      if (result.error) return toast.error(result.error);
      toast.success(result.message);
      router.push(`/bots/${result.data.id}`);
    });

  const setParam = (key, value) => setParams((current) => ({ ...current, [key]: value }));
  const setLimit = (key, value) => setRisk((current) => ({ ...current, [key]: value }));

  return (
    <div className={styles.builder}>
      <div className="stack gap-lg">
        <Panel title="1. Strategy" icon={TbTarget}>
          <div className={styles.picker}>
            {strategies.map((entry) => (
              <button key={entry.key} type="button" className={cx(styles.option, entry.key === strategyKey && styles.chosen)} disabled={entry.locked || Boolean(initial?.id)} onClick={() => choose(entry)}>
                <strong>
                  {entry.locked && <TbLock aria-hidden="true" />} {entry.name}
                </strong>
                <EvidenceBadge evidence={entry.evidence} label={entry.evidenceLabel} />
              </button>
            ))}
          </div>
          <p className={styles.summary}>{strategy.summary}</p>
        </Panel>

        <Panel title="2. Market and settings" icon={TbAdjustments}>
          <div className={styles.fields}>
            <Field label="Bot name">
              <input value={name} placeholder={strategy.name} maxLength={60} onChange={(event) => setName(event.target.value)} />
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
            <Field label="Deriv account" hint={accounts.length ? undefined : "Link an account first"}>
              <select value={accountId} onChange={(event) => setAccountId(event.target.value)} required>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.derivId} · {account.isVirtual ? "Demo" : "Real"}
                  </option>
                ))}
              </select>
            </Field>
            {strategy.params.filter((param) => !param.when || Object.entries(param.when).every(([key, values]) => values.includes(params[key]))).map((param) => (
              <Field key={param.key} label={param.label}>
                {param.type === "select" ? (
                  <select value={params[param.key]} onChange={(event) => setParam(param.key, event.target.value)}>
                    {param.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : param.type === "boolean" ? (
                  <select value={params[param.key] ? "on" : "off"} onChange={(event) => setParam(param.key, event.target.value === "on")}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                ) : (
                  <input type={param.type === "time" ? "time" : "number"} value={params[param.key]} min={param.min} max={param.max} step={param.step} onChange={(event) => setParam(param.key, param.type === "time" ? event.target.value : Number(event.target.value))} />
                )}
              </Field>
            ))}
          </div>
        </Panel>

        <Panel title="3. Safety limits" icon={TbShieldCheck}>
          <div className={styles.fields}>
            {(strategy.market === "forex" ? FOREX_RISK : SYNTHETIC_RISK).map(([key, label, , min, max, step]) => (
              <Field key={key} label={label}>
                <input type="number" value={risk[key] ?? ""} min={min} max={max} step={step} placeholder="Off" onChange={(event) => setLimit(key, event.target.value === "" ? "" : Number(event.target.value))} />
              </Field>
            ))}
            {strategy.market === "synthetic" && (
              <>
                <Field label="Staking after a loss" hint="Recovery staking never improves the odds">
                  <select value={risk.recovery} onChange={(event) => setLimit("recovery", event.target.value)}>
                    <option value="flat">Flat stake (recommended)</option>
                    <option value="martingale">Martingale recovery</option>
                  </select>
                </Field>
                {risk.recovery === "martingale" && (
                  <>
                    <Field label="Multiply stake by">
                      <input type="number" value={risk.recoveryFactor} min={1.1} max={3} step={0.1} onChange={(event) => setLimit("recoveryFactor", Number(event.target.value))} />
                    </Field>
                    <Field label="Recovery steps">
                      <input type="number" value={risk.recoveryLevels} min={1} max={6} step={1} onChange={(event) => setLimit("recoveryLevels", Number(event.target.value))} />
                    </Field>
                  </>
                )}
              </>
            )}
          </div>
        </Panel>
      </div>

      <aside className={styles.side}>
        <Panel title={strategy.market === "forex" ? "What it costs" : "The real odds"} icon={TbAlertTriangle} className={styles.preview}>
          {!preview ? (
            <p className="muted">Calculating…</p>
          ) : preview.market === "forex" ? (
            <div className="stack gap-md">
              <p className="muted">{preview.note}</p>
              <dl className={styles.facts}>
                <div>
                  <dt>Estimated spread</dt>
                  <dd className="mono">{preview.costs.spread}</dd>
                </div>
                <div>
                  <dt>Commission</dt>
                  <dd className="mono">{percent(preview.costs.commission, 3)}</dd>
                </div>
                {preview.costGate?.risk && (
                  <div>
                    <dt>Skips trades risking under</dt>
                    <dd className="mono">{preview.costGate.risk}× costs</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : preview.probability === undefined ? (
            <p className="muted">{preview.note}</p>
          ) : (
            <div className="stack gap-md">
              <dl className={styles.facts}>
                <div>
                  <dt>Chance to win</dt>
                  <dd className="mono">{percent(preview.probability, 0)}</dd>
                </div>
                <div>
                  <dt>Payout if it wins</dt>
                  <dd className="mono">{percent(preview.payoutRatio, 1)}</dd>
                </div>
                <div>
                  <dt>Win rate needed to break even</dt>
                  <dd className="mono">{percent(preview.breakEvenWinRate, 1)}</dd>
                </div>
                <div>
                  <dt>Average result per trade</dt>
                  <dd className="mono down">{percent(preview.expectedPerTrade, 2)}</dd>
                </div>
              </dl>
              <p className={styles.warning}>
                On average, 100 trades at this stake lose about <strong>{money(preview.expectedLossPer100)}</strong>. {preview.livePayout ? "Based on Deriv’s live payout." : "Based on typical payouts."}
              </p>
              {preview.ladder && (
                <p className={styles.danger}>
                  Martingale: a full losing ladder happens about once every {Math.round(1 / preview.ladder.bustChance).toLocaleString()} cycles and costs {preview.ladder.bustUnits.toFixed(1)}× your stake. Over 1,000 cycles that is a {percent(preview.ladder.bustWithin1000, 0)} chance.
                </p>
              )}
              <dl className={styles.facts}>
                <div>
                  <dt>Typical day ({preview.simulation.trades} trades)</dt>
                  <dd className={cx("mono", preview.simulation.median >= 0 ? "up" : "down")}>{money(preview.simulation.median)}</dd>
                </div>
                <div>
                  <dt>Bad day (worst 5%)</dt>
                  <dd className="mono down">{money(preview.simulation.worst5)}</dd>
                </div>
                <div>
                  <dt>Days that hit your loss limit</dt>
                  <dd className="mono">{percent(preview.simulation.stopChance, 0)}</dd>
                </div>
              </dl>
              <small className="faint">From 10,000 simulated sessions at true odds.</small>
            </div>
          )}
        </Panel>
        <Button size="lg" block icon={TbDeviceFloppy} loading={pending} disabled={!accountId} onClick={save}>
          {initial?.id ? "Save changes" : "Create bot"}
        </Button>
      </aside>
    </div>
  );
}
