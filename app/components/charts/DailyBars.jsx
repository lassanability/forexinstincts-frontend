import { cx } from "@/app/lib/cx";
import { shortDate, signedMoney } from "@/app/lib/format";
import styles from "@/app/styles/dailyBars.module.css";

const HEIGHT = 140;

export default function DailyBars({ days }) {
  const peak = Math.max(...days.map((day) => Math.abs(day.profit)), 1);
  const width = Math.max(days.length * 18, 180);

  return (
    <figure className={styles.figure}>
      <svg viewBox={`0 0 ${width} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Daily profit and loss">
        <line x1="0" x2={width} y1={HEIGHT / 2} y2={HEIGHT / 2} className={styles.axis} />
        {days.map((day, index) => {
          const size = (Math.abs(day.profit) / peak) * (HEIGHT / 2 - 6);
          return (
            <rect key={day.day} x={index * 18 + 4} y={day.profit >= 0 ? HEIGHT / 2 - size : HEIGHT / 2} width="10" height={Math.max(size, 1)} rx="3" className={cx(styles.bar, day.profit >= 0 ? styles.up : styles.down)}>
              <title>{`${shortDate(day.day)}: ${signedMoney(day.profit)} (${day.trades} trades)`}</title>
            </rect>
          );
        })}
      </svg>
    </figure>
  );
}
