import Image from "next/image";
import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/pride.module.css";

const BOTS = [
  { name: "London Breakout", market: "Gold · 15m", ring: styles.inner },
  { name: "Regime Guardian", market: "EUR/USD · 1h", ring: styles.middle },
  { name: "Trend Pullback", market: "GBP/USD · 5m", ring: styles.outer },
];

export default function Pride() {
  return (
    <div className={styles.pride}>
      <span className={styles.sun} aria-hidden="true" />
      <Image src="/mark.png" alt="" width={360} height={360} priority className={styles.lion} />
      {BOTS.map((bot) => (
        <div key={bot.name} className={cx(styles.orbit, bot.ring)}>
          <span className={styles.ember}>
            <span className={cx("glass", styles.tag)}>
              <strong>{bot.name}</strong>
              <small>{bot.market}</small>
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
