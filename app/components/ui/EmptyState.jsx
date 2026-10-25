import styles from "@/app/styles/emptyState.module.css";

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className={styles.empty}>
      {Icon && (
        <span className={styles.icon}>
          <Icon aria-hidden="true" />
        </span>
      )}
      <strong>{title}</strong>
      {message && <p className="muted">{message}</p>}
      {action}
    </div>
  );
}
