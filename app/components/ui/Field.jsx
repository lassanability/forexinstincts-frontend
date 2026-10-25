import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/field.module.css";

export default function Field({ label, hint, error, children, className }) {
  return (
    <label className={cx(styles.field, className)}>
      {label && <span className={styles.label}>{label}</span>}
      {children}
      {error ? <small className={styles.error}>{error}</small> : hint && <small className={styles.hint}>{hint}</small>}
    </label>
  );
}
