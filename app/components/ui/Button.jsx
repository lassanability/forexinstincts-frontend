import { cx } from "@/app/lib/cx";
import Spinner from "@/app/components/ui/Spinner";
import styles from "@/app/styles/button.module.css";

export default function Button({ type = "button", variant = "primary", size = "md", icon: Icon, block = false, loading = false, disabled = false, children, className, ...rest }) {
  return (
    <button type={type} className={cx(styles.button, styles[variant], styles[size], block && styles.block, className)} aria-busy={loading} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner /> : Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  );
}
