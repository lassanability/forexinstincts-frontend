import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/panel.module.css";

export default function Panel({ title, icon: Icon, actions, padded = true, className, children, as: Tag = "section" }) {
  return (
    <Tag className={cx("glass", styles.panel, className)}>
      {(title || actions) && (
        <header className={styles.head}>
          {Icon && (
            <span className={styles.icon}>
              <Icon aria-hidden="true" />
            </span>
          )}
          {title && <h2 className={cx(styles.title, "grow")}>{title}</h2>}
          {actions}
        </header>
      )}
      <div className={cx(styles.body, padded && styles.padded)}>{children}</div>
    </Tag>
  );
}
