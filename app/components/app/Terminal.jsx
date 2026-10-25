"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { TbArrowDownRight, TbArrowUpRight, TbChartCandle, TbReceipt, TbX } from "react-icons/tb";
import { loadBalance, loadPositions, terminalBuy, terminalSell } from "@/app/actions/trading";
import LiveChart from "@/app/components/charts/LiveChart";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import Panel from "@/app/components/ui/Panel";
import Pnl from "@/app/components/ui/Pnl";
import { cx } from "@/app/lib/cx";
import { money } from "@/app/lib/format";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/terminal.module.css";

const POSITIONS_MS = 5000;
const GROUPS = { forex: "Forex", commodities: "Commodities", synthetic_index: "Synthetics", indices: "Indices" };
const KINDS = [
  { value: "multiplier", label: "Multiplier" },
  { value: "risefall", label: "Rise / Fall" },
  { value: "digits", label: "Digits" },
  { value: "accumulator", label: "Accumulator" },
];
const DIGIT_TYPES = [
  ["DIGITEVEN", "Even"],
  ["DIGITODD", "Odd"],
  ["DIGITOVER", "Over"],
  ["DIGITUNDER", "Under"],
  ["DIGITMATCH", "Matches"],
  ["DIGITDIFF", "Differs"],
];

export default function Terminal({ accounts, markets }) {
  const [accountId, setAccountId] = useState(accounts.find((account) => account.isVirtual)?.id ?? accounts[0]?.id);
  const [symbol, setSymbol] = useState("R_100");
  const [kind, setKind] = useState("multiplier");
  const [stake, setStake] = useState(10);
  const [multiplier, setMultiplier] = useState(100);
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [duration, setDuration] = useState(5);
  const [digitType, setDigitType] = useState("DIGITEVEN");
  const [barrier, setBarrier] = useState(5);
  const [growthRate, setGrowthRate] = useState(0.01);
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [pending, start] = useTransition();
  const market = markets.find((entry) => entry.symbol === symbol);
  const synthetic = market?.market === "synthetic_index";

  const refresh = useCallback(async () => {
    if (!accountId) return;
    const [open, funds] = await Promise.all([loadPositions(accountId), loadBalance(accountId)]);
    if (open.data) setPositions(open.data);
    if (funds.data) setBalance(funds.data);
  }, [accountId]);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const timer = setInterval(refresh, POSITIONS_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refresh]);

  const place = (contractType) =>
    start(async () => {
      const result = await terminalBuy({ accountId, symbol, contractType, stake, multiplier, stopLoss, takeProfit, duration, durationUnit: "t", barrier, growthRate });
      if (result.error) return toast.error(result.error);
      toast.success(`Contract #${result.data.contractId} opened`);
      refresh();
    });

  const close = (contractId) =>
    start(async () => {
      const result = await terminalSell(accountId, contractId);
      if (result.error) return toast.error(result.error);
      toast.success("Position closed");
      refresh();
    });

  const kinds = KINDS.filter((entry) => synthetic || entry.value === "multiplier" || entry.value === "risefall");

  return (
    <div className={styles.terminal}>
      <Panel
        title={market?.name ?? symbol}
        icon={TbChartCandle}
        padded={false}
        className={styles.chart}
        actions={
          <select
            value={symbol}
            onChange={(event) => {
              setSymbol(event.target.value);
              if (markets.find((entry) => entry.symbol === event.target.value)?.market !== "synthetic_index" && ["digits", "accumulator"].includes(kind)) setKind("multiplier");
            }}
            className={styles.select}
            aria-label="Market"
          >
            {Object.entries(GROUPS).map(([group, label]) => (
              <optgroup key={group} label={label}>
                {markets
                  .filter((entry) => entry.market === group)
                  .map((entry) => (
                    <option key={entry.symbol} value={entry.symbol}>
                      {entry.name}
                      {entry.open ? "" : " (closed)"}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        }
      >
        <LiveChart key={symbol} symbol={symbol} granularity={60} size="lg" />
      </Panel>

      <Panel title="Order ticket" className={styles.ticket}>
        <div className="stack gap-md">
          <Field label="Account">
            <select value={accountId} onChange={(event) => setAccountId(event.target.value)}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.derivId} · {account.isVirtual ? "Demo" : "Real"}
                </option>
              ))}
            </select>
          </Field>
          {balance && <p className="mono muted">Balance {money(balance.balance, balance.currency)}</p>}
          <div className={styles.kinds} role="tablist" aria-label="Contract type">
            {kinds.map((entry) => (
              <button key={entry.value} type="button" role="tab" aria-selected={kind === entry.value} className={cx(styles.kind, kind === entry.value && styles.activeKind)} onClick={() => setKind(entry.value)}>
                {entry.label}
              </button>
            ))}
          </div>
          <Field label="Stake">
            <input type="number" value={stake} min={0.35} step={0.01} onChange={(event) => setStake(Number(event.target.value))} />
          </Field>

          {kind === "multiplier" && (
            <>
              <Field label="Multiplier">
                <select value={multiplier} onChange={(event) => setMultiplier(Number(event.target.value))}>
                  {(synthetic ? [40, 100, 200, 300, 400] : [100, 200, 300, 500, 800]).map((value) => (
                    <option key={value} value={value}>
                      x{value}
                    </option>
                  ))}
                </select>
              </Field>
              <div className={styles.pair}>
                <Field label="Stop loss ($)">
                  <input type="number" value={stopLoss} min={0} step={0.01} placeholder="None" onChange={(event) => setStopLoss(event.target.value)} />
                </Field>
                <Field label="Take profit ($)">
                  <input type="number" value={takeProfit} min={0} step={0.01} placeholder="None" onChange={(event) => setTakeProfit(event.target.value)} />
                </Field>
              </div>
            </>
          )}

          {(kind === "risefall" || kind === "digits") && (
            <Field label="Duration (ticks)">
              <input type="number" value={duration} min={1} max={10} onChange={(event) => setDuration(Number(event.target.value))} />
            </Field>
          )}

          {kind === "digits" && (
            <div className={styles.pair}>
              <Field label="Contract">
                <select value={digitType} onChange={(event) => setDigitType(event.target.value)}>
                  {DIGIT_TYPES.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              {!["DIGITEVEN", "DIGITODD"].includes(digitType) && (
                <Field label="Digit">
                  <input type="number" value={barrier} min={0} max={9} onChange={(event) => setBarrier(Number(event.target.value))} />
                </Field>
              )}
            </div>
          )}

          {kind === "accumulator" && (
            <div className={styles.pair}>
              <Field label="Growth per tick">
                <select value={growthRate} onChange={(event) => setGrowthRate(Number(event.target.value))}>
                  {[0.01, 0.02, 0.03, 0.04, 0.05].map((value) => (
                    <option key={value} value={value}>
                      {value * 100}%
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Take profit ($)">
                <input type="number" value={takeProfit} min={0} step={0.01} placeholder="None" onChange={(event) => setTakeProfit(event.target.value)} />
              </Field>
            </div>
          )}

          {kind === "multiplier" && (
            <div className={styles.pair}>
              <Button icon={TbArrowUpRight} loading={pending} onClick={() => place("MULTUP")}>
                Up
              </Button>
              <Button variant="danger" icon={TbArrowDownRight} loading={pending} onClick={() => place("MULTDOWN")}>
                Down
              </Button>
            </div>
          )}
          {kind === "risefall" && (
            <div className={styles.pair}>
              <Button icon={TbArrowUpRight} loading={pending} onClick={() => place("CALL")}>
                Rise
              </Button>
              <Button variant="danger" icon={TbArrowDownRight} loading={pending} onClick={() => place("PUT")}>
                Fall
              </Button>
            </div>
          )}
          {kind === "digits" && (
            <Button loading={pending} onClick={() => place(digitType)}>
              Buy contract
            </Button>
          )}
          {kind === "accumulator" && (
            <Button loading={pending} onClick={() => place("ACCU")}>
              Start accumulator
            </Button>
          )}
          {kind === "digits" && <small className="faint">Digit contracts lose about 1–9% of the stake on average. No pattern predicts the next digit.</small>}
        </div>
      </Panel>

      <Panel title="Open positions" icon={TbReceipt} padded={false} className={styles.positions}>
        {positions.length === 0 ? (
          <p className={cx("muted", styles.empty)}>No open positions on this account.</p>
        ) : (
          <ul>
            {positions.map((position) => (
              <li key={position.contract_id} className={styles.position}>
                <Badge tone={/UP|CALL/.test(position.contract_type) ? "up" : "cyan"}>{position.contract_type}</Badge>
                <span className="grow truncate">{position.underlying_symbol ?? position.symbol}</span>
                <span className="mono">{money(position.buy_price)}</span>
                {position.profit !== undefined && <Pnl value={position.profit} />}
                <Button size="sm" variant="ghost" icon={TbX} loading={pending} onClick={() => close(position.contract_id)}>
                  Close
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
