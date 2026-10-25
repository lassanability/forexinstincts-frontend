import { notFound } from "next/navigation";
import { TbAdjustments, TbChartCandle, TbReceipt, TbShieldCheck } from "react-icons/tb";
import BotBuilder from "@/app/components/app/BotBuilder";
import BotControls from "@/app/components/app/BotControls";
import TradeTable from "@/app/components/app/TradeTable";
import LiveChart from "@/app/components/charts/LiveChart";
import Panel from "@/app/components/ui/Panel";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Bot" };

const LIMITS = [
  ["maxStake", "Largest stake"],
  ["riskPercent", "Risk per trade %"],
  ["maxDailyLoss", "Daily loss limit"],
  ["maxWeeklyLoss", "Weekly loss limit"],
  ["dailyTarget", "Daily target"],
  ["maxLossStreak", "Losses in a row"],
  ["maxDrawdownPercent", "Drawdown %"],
];

export default async function BotPage({ params }) {
  const { id } = await params;
  const [bot, strategies, accounts] = await Promise.all([request(`/web/bots/${id}`), request("/web/strategies"), request("/web/accounts")]);
  if (!bot.ok) notFound();

  const { trades, ...detail } = bot.data;
  const strategy = (strategies.data ?? []).find((entry) => entry.key === detail.strategy);
  const markers = trades.filter((trade) => trade.entryPrice).map((trade) => ({ time: Math.floor(new Date(trade.openedAt).getTime() / 1000), price: trade.entryPrice, side: trade.contractType === "MULTDOWN" ? "sell" : "buy" }));

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>{detail.name}</h1>
          <p>
            {strategy?.name ?? detail.strategy} on {detail.symbol.replace("frx", "")}
          </p>
        </div>
      </header>

      <BotControls bot={detail} />

      <div className={styles.columns}>
        <Panel title={`${detail.symbol.replace("frx", "")} live`} icon={TbChartCandle} padded={false}>
          <LiveChart key={detail.symbol} symbol={detail.symbol} granularity={strategy?.granularity ?? 60} size="lg" markers={markers} />
        </Panel>
        <Panel title="Safety limits" icon={TbShieldCheck}>
          <dl className="stack">
            {LIMITS.filter(([key]) => detail.risk[key] !== null && detail.risk[key] !== undefined && (detail.market === "forex" || key !== "riskPercent")).map(([key, label]) => (
              <div key={key} className="row gap-md">
                <dt className="grow muted">{label}</dt>
                <dd className="mono">{detail.risk[key]}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel title="Trades" icon={TbReceipt} padded={false}>
        <TradeTable trades={trades} botId={detail.id} />
      </Panel>

      {detail.status !== "running" && strategy && (
        <Panel title="Edit this bot" icon={TbAdjustments}>
          <BotBuilder strategies={strategies.data} accounts={accounts.data ?? []} initial={{ ...detail, accountId: detail.accountId }} />
        </Panel>
      )}
    </>
  );
}
