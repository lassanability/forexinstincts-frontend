import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/stat.module.css";

export default function Stat({ label, value, note, tone, icon: Icon }) {
  return (
    <div className={cx("glass", styles.stat)}>
      <span className={styles.label}>
        {Icon && <Icon aria-hidden="true" />}
        {label}
      </span>
      <strong className={cx("mono", styles.value, tone)}>{value}</strong>
      {note && <small className={styles.note}>{note}</small>}
    </div>
  );
}
