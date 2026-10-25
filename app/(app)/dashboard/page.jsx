import Link from "next/link";
import { TbActivity, TbChartBar, TbLink, TbPlus, TbReceipt, TbRobot, TbSparkles } from "react-icons/tb";
import BotList from "@/app/components/app/BotList";
import TradeTable from "@/app/components/app/TradeTable";
import DailyBars from "@/app/components/charts/DailyBars";
import ButtonLink from "@/app/components/ui/ButtonLink";
import EmptyState from "@/app/components/ui/EmptyState";
import Panel from "@/app/components/ui/Panel";
import Stat from "@/app/components/ui/Stat";
import { cx } from "@/app/lib/cx";
import { signedMoney, toneOf } from "@/app/lib/format";
import { request } from "@/app/lib/session";
import styles from "@/app/styles/appPage.module.css";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [me, accounts, bots, summary, trades] = await Promise.all([request("/auth/me"), request("/web/accounts"), request("/web/bots"), request("/web/trades/summary?days=30"), request("/web/trades")]);
  const access = me.data?.access;
  const botList = bots.data ?? [];
  const today = (summary.data?.daily ?? []).at(-1);
  const isToday = today?.day === new Date().toISOString().slice(0, 10);
  const linked = (accounts.data ?? []).length > 0;
  const running = botList.filter((bot) => bot.status === "running").length;

  const steps = [
    { done: linked, title: "Link your Deriv account", text: "Create a token with the Trade scope and paste it in.", href: "/accounts" },
    { done: botList.length > 0, title: "Build a bot", text: "Pick a strategy and set your limits.", href: "/bots/new" },
    { done: running > 0, title: "Start it on demo", text: "Watch it trade before you risk real money.", href: "/bots" },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>
            Command <span className="gradient-text">center</span>
          </h1>
          <p>Your bots run on our servers around the clock. Everything here updates live.</p>
        </div>
        <div className={styles.actions}>
          <ButtonLink href="/bots/new" icon={TbPlus}>
            New bot
          </ButtonLink>
        </div>
      </header>

      <div className={styles.stats}>
        <Stat label="Today" icon={TbActivity} value={signedMoney(isToday ? today.profit : 0)} tone={toneOf(isToday ? today.profit : 0)} note={`${isToday ? today.trades : 0} closed trades`} />
        <Stat label="Running bots" icon={TbRobot} value={`${running}/${access?.limits.bots ?? 0}`} note={`${botList.length} bots in total`} />
        <Stat label="Open trades" icon={TbReceipt} value={summary.data?.open ?? 0} note="Updated live" />
        <Stat label="Plan" icon={TbSparkles} value={(access?.tier ?? "free").replace(/^./, (letter) => letter.toUpperCase())} note={access?.expiresAt ? `Until ${new Date(access.expiresAt).toLocaleDateString("en-GB")}` : "Demo bots are free"} />
      </div>

      {steps.some((step) => !step.done) && (
        <Panel title="Get your first bot running" icon={TbLink}>
          <div className={styles.steps}>
            {steps.map((step, index) => (
              <Link key={step.title} href={step.href} className={cx(styles.step, step.done && styles.done)}>
                <b>{step.done ? "✓ Done" : `0${index + 1}`}</b>
                <strong>{step.title}</strong>
                <small className="muted">{step.text}</small>
              </Link>
            ))}
          </div>
        </Panel>
      )}

      <div className={styles.columns}>
        <Panel title="Your bots" icon={TbRobot} padded={false} actions={<ButtonLink href="/bots" size="sm" variant="ghost">All bots</ButtonLink>}>
          {botList.length ? <BotList bots={botList.slice(0, 6)} /> : <EmptyState icon={TbRobot} title="No bots yet" message="Build one from a researched strategy or the marketplace." action={<ButtonLink href="/bots/new" icon={TbPlus}>Build a bot</ButtonLink>} />}
        </Panel>
        <Panel title="Last 30 days" icon={TbChartBar}>
          {summary.data?.daily?.length ? <DailyBars days={summary.data.daily} /> : <p className="muted">Daily results appear here once trades close.</p>}
        </Panel>
      </div>

      <Panel title="Recent trades" icon={TbReceipt} padded={false}>
        {trades.data?.trades?.length ? <TradeTable trades={trades.data.trades.slice(0, 15)} /> : <EmptyState icon={TbReceipt} title="No trades yet" message="Trades from your bots and the terminal show up here in real time." />}
      </Panel>
    </>
  );
}
