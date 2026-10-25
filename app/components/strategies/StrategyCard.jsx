import Link from "next/link";
import { TbArrowUpRight, TbLock } from "react-icons/tb";
import EvidenceBadge from "@/app/components/strategies/EvidenceBadge";
import Badge from "@/app/components/ui/Badge";
import { cx } from "@/app/lib/cx";
import { durationOf } from "@/app/lib/format";
import styles from "@/app/styles/strategyCard.module.css";

export default function StrategyCard({ strategy }) {
  return (
    <Link href={`/strategies/${strategy.key}`} className={cx("glass", styles.card, strategy.original && styles.original)}>
      <div className={styles.top}>
        <EvidenceBadge evidence={strategy.evidence} label={strategy.evidenceLabel} />
        {strategy.locked && <Badge icon={TbLock}>Pro</Badge>}
        <TbArrowUpRight className={styles.arrow} aria-hidden="true" />
      </div>
      <h3>{strategy.name}</h3>
      <p className="muted">{strategy.summary}</p>
      <div className={styles.meta}>
        <span>{strategy.market === "forex" ? "Forex & gold" : "Synthetics"}</span>
        {strategy.granularity && <span className="mono">{durationOf(strategy.granularity)}</span>}
        <span className="mono">{strategy.symbols.slice(0, 3).map((symbol) => symbol.replace("frx", "")).join(" · ")}</span>
      </div>
    </Link>
  );
}
