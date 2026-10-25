import Link from "next/link";
import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/button.module.css";

export default function ButtonLink({ href, variant = "primary", size = "md", icon: Icon, block = false, children, className, ...rest }) {
  return (
    <Link href={href} className={cx(styles.button, styles[variant], styles[size], block && styles.block, className)} {...rest}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </Link>
  );
}
