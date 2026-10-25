import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/badge.module.css";

export default function Badge({ tone = "plain", icon: Icon, pulse = false, children }) {
  return (
    <span className={cx(styles.badge, styles[tone])}>
      {pulse && <i className={styles.dot} aria-hidden="true" />}
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  );
}
