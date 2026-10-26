import Link from "next/link";
import { TbArrowUpRight, TbUsers } from "react-icons/tb";
import EvidenceBadge from "@/app/components/strategies/EvidenceBadge";
import Badge from "@/app/components/ui/Badge";
import { cx } from "@/app/lib/cx";
import { percent, toneOf } from "@/app/lib/format";
import styles from "@/app/styles/presetCard.module.css";

export default function PresetCard({ preset }) {
  const record = preset.record;

  return (
    <Link href={`/marketplace/${preset.slug}`} className={cx("glass", styles.card, preset.featured && styles.featured)}>
      <div className="row gap-sm">
        {preset.strategyInfo && <EvidenceBadge evidence={preset.strategyInfo.evidence} label={preset.strategyInfo.name} />}
        {preset.minTier !== "free" && <Badge tone="ember">{preset.minTier}</Badge>}
        <TbArrowUpRight className={styles.arrow} aria-hidden="true" />
      </div>
      <h3>{preset.title}</h3>
      <p className="muted">{preset.summary}</p>
      <dl className={styles.record}>
        <div>
          <dt>Live trades</dt>
          <dd className="mono">{record?.trades ?? 0}</dd>
        </div>
        <div>
          <dt>Return on stake</dt>
          <dd className={cx("mono", toneOf(record?.returnOnTurnover))}>{record ? percent(record.returnOnTurnover, 2) : "—"}</dd>
        </div>
        <div>
          <dt>Edge vs random</dt>
          <dd className={cx("mono", toneOf(record?.edgeVsRandom))}>{record ? percent(record.edgeVsRandom, 2) : "—"}</dd>
        </div>
      </dl>
      <span className={styles.users}>
        <TbUsers aria-hidden="true" /> {preset.users} traders use it
      </span>
    </Link>
  );
}
