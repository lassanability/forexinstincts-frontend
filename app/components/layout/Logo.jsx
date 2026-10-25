import Image from "next/image";
import Link from "next/link";
import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/logo.module.css";

export default function Logo({ compact = false, href = "/" }) {
  return (
    <Link href={href} className={cx(styles.logo, compact && styles.compact)} aria-label="ForexInstincts home">
      <Image src="/logo.svg" alt="" width={36} height={36} priority />
      <span className={styles.name}>
        Forex<span className="gradient-text">Instincts</span>
      </span>
    </Link>
  );
}
