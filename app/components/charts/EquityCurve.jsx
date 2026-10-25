import styles from "@/app/styles/equityCurve.module.css";

const WIDTH = 600;
const HEIGHT = 220;
const PAD = 8;

export default function EquityCurve({ points }) {
  if (points.length < 2) return <p className="muted">Not enough trades to draw a curve.</p>;

  const values = points.map((point) => point.equity);
  const high = Math.max(...values, 100);
  const low = Math.min(...values, 100);
  const span = high - low || 1;
  const x = (index) => PAD + (index / (points.length - 1)) * (WIDTH - PAD * 2);
  const y = (value) => PAD + ((high - value) / span) * (HEIGHT - PAD * 2);
  const line = points.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.equity).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${HEIGHT} L${x(0)},${HEIGHT} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Equity curve">
      <defs>
        <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#19f5c1" stopOpacity="0.35" />
          <stop offset="1" stopColor="#19f5c1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="equity-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#19f5c1" />
          <stop offset="1" stopColor="#2bd9ff" />
        </linearGradient>
      </defs>
      <line x1="0" x2={WIDTH} y1={y(100)} y2={y(100)} className={styles.base} />
      <path d={area} fill="url(#equity-fill)" />
      <path d={line} fill="none" stroke="url(#equity-line)" strokeWidth="2.5" className={styles.line} />
    </svg>
  );
}
