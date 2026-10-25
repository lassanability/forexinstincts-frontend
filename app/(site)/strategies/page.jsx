import StrategyCard from "@/app/components/strategies/StrategyCard";
import { getStrategies } from "@/app/lib/api";
import site from "@/app/styles/site.module.css";

export const revalidate = 300;

export const metadata = {
  title: "Trading strategies",
  description: "Research-backed forex, gold and synthetic trading strategies for Deriv, each labelled with the strength of the evidence behind it.",
};

export default async function StrategiesPage() {
  const strategies = (await getStrategies()) ?? [];
  const forex = strategies.filter((strategy) => strategy.market === "forex");
  const synthetic = strategies.filter((strategy) => strategy.market === "synthetic");

  return (
    <div className={site.page}>
      <header className={site.header}>
        <span className={site.eyebrow}>Strategy library</span>
        <h1 className={site.title}>
          Every strategy, with <span className="gradient-text">the evidence on the label</span>
        </h1>
        <p className={site.lead}>We replaced the old crossover and martingale templates with what traders discuss and test today. Where independent tests show a strategy failing after costs, we say so. Parameters are starting points to backtest, not promises.</p>
      </header>

      <section className="stack gap-lg" aria-labelledby="forex">
        <h2 id="forex">Forex and gold</h2>
        <div className={site.grid}>
          {forex.map((strategy) => (
            <StrategyCard key={strategy.key} strategy={strategy} />
          ))}
        </div>
      </section>

      <section className="stack gap-lg" aria-labelledby="synthetics">
        <h2 id="synthetics">Synthetic indices</h2>
        <div className={site.grid}>
          {synthetic.map((strategy) => (
            <StrategyCard key={strategy.key} strategy={strategy} />
          ))}
        </div>
      </section>
    </div>
  );
}
