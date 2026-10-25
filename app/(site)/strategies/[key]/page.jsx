import { notFound } from "next/navigation";
import { TbChecklist, TbRocket, TbSettings } from "react-icons/tb";
import EvidenceBadge from "@/app/components/strategies/EvidenceBadge";
import Badge from "@/app/components/ui/Badge";
import ButtonLink from "@/app/components/ui/ButtonLink";
import Panel from "@/app/components/ui/Panel";
import { getStrategy } from "@/app/lib/api";
import { durationOf } from "@/app/lib/format";
import site from "@/app/styles/site.module.css";
import styles from "@/app/styles/strategyPage.module.css";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const strategy = await getStrategy((await params).key);
  return strategy ? { title: `${strategy.name} strategy`, description: strategy.summary } : {};
}

const valueOf = (param) => (param.type === "select" ? param.options.find((option) => option.value === param.default)?.label : param.type === "boolean" ? (param.default ? "On" : "Off") : String(param.default));

export default async function StrategyPage({ params }) {
  const strategy = await getStrategy((await params).key);
  if (!strategy) notFound();

  return (
    <div className={site.page}>
      <header className={site.header}>
        <div className="row gap-sm">
          <EvidenceBadge evidence={strategy.evidence} label={strategy.evidenceLabel} />
          {strategy.experimental && <Badge tone="warn">Experimental</Badge>}
        </div>
        <h1 className={site.title}>{strategy.name}</h1>
        <p className={site.lead}>{strategy.summary}</p>
        <div className="row gap-md">
          <ButtonLink href={`/bots/new?strategy=${strategy.key}`} icon={TbRocket}>
            Build this bot
          </ButtonLink>
          {strategy.market === "forex" && (
            <ButtonLink href={`/backtests?strategy=${strategy.key}`} variant="glass">
              Backtest it
            </ButtonLink>
          )}
        </div>
      </header>

      <div className={styles.layout}>
        <Panel title="The rules" icon={TbChecklist}>
          <ol className={styles.rules}>
            {strategy.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </Panel>

        <Panel title="Default settings" icon={TbSettings}>
          <dl className={styles.params}>
            <div>
              <dt>Markets</dt>
              <dd className="mono">{strategy.symbols.map((symbol) => symbol.replace("frx", "")).join(", ")}</dd>
            </div>
            {strategy.granularity && (
              <div>
                <dt>Candles</dt>
                <dd className="mono">{durationOf(strategy.granularity)}</dd>
              </div>
            )}
            {strategy.params.map((param) => (
              <div key={param.key}>
                <dt>{param.label}</dt>
                <dd className="mono">{valueOf(param)}</dd>
              </div>
            ))}
            {strategy.costGate && (
              <div>
                <dt>Cost check</dt>
                <dd>{[strategy.costGate.risk && `risk ≥ ${strategy.costGate.risk}× costs`, strategy.costGate.target && `target ≥ ${strategy.costGate.target}× costs`].filter(Boolean).join(", ")}</dd>
              </div>
            )}
          </dl>
        </Panel>
      </div>

      <p className={styles.note}>Every setting is a starting point to backtest on Deriv history, not a proven result. Trading carries a high risk of loss.</p>
    </div>
  );
}
