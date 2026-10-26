"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/app/lib/derivFeed";
import styles from "@/app/styles/heartbeat.module.css";

const LENGTH = 140;
const WIDTH = 1400;
const HEIGHT = 180;
const PAD = 22;

const toPath = (prices) => {
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const span = high - low || 1;
  const step = WIDTH / (LENGTH - 1);
  const offset = (LENGTH - prices.length) * step;
  return prices.map((price, index) => [offset + index * step, PAD + ((high - price) / span) * (HEIGHT - PAD * 2)]);
};

export default function Heartbeat({ symbol = "1HZ100V", label = "Volatility 100 (1s)" }) {
  const [feed, setFeed] = useState({ prices: [], pip: 2 });

  useEffect(
    () =>
      subscribe({ ticks_history: symbol, style: "ticks", count: LENGTH, end: "latest" }, (message) => {
        if (message.history) return setFeed({ prices: message.history.prices.map(Number), pip: message.pip_size ?? 2 });
        if (message.tick) setFeed((current) => ({ prices: [...current.prices.slice(-LENGTH + 1), Number(message.tick.quote)], pip: message.tick.pip_size ?? current.pip }));
      }),
    [symbol]
  );

  const points = feed.prices.length > 1 ? toPath(feed.prices) : [[0, HEIGHT / 2], [WIDTH, HEIGHT / 2]];
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${WIDTH},${HEIGHT} L${points[0][0].toFixed(1)},${HEIGHT} Z`;
  const [headX, headY] = points.at(-1);
  const last = feed.prices.at(-1);
  const move = feed.prices.length > 1 ? Math.sign(last - feed.prices.at(-2)) : 0;

  return (
    <figure className={styles.heartbeat} aria-label={`${label} live ticks`}>
      <figcaption className={styles.caption}>
        <span className={styles.live}>Market heartbeat</span>
        <span className={styles.symbol}>{label}</span>
        <span className={`mono ${move < 0 ? "down" : "up"}`}>{last === undefined ? "···" : last.toFixed(feed.pip)}</span>
      </figcaption>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMaxYMid slice" className={styles.svg} aria-hidden="true">
        <defs>
          <linearGradient id="beat-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff7a3d" stopOpacity="0" />
            <stop offset="0.45" stopColor="#ff7a3d" />
            <stop offset="0.8" stopColor="#f2b544" />
            <stop offset="1" stopColor="#ffe8b4" />
          </linearGradient>
          <linearGradient id="beat-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2b544" stopOpacity="0.22" />
            <stop offset="1" stopColor="#f2b544" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#beat-fill)" className={styles.area} />
        <path d={line} fill="none" stroke="url(#beat-stroke)" strokeWidth="2" className={styles.line} />
        <line x1={headX} x2={headX} y1="0" y2={HEIGHT} className={styles.cursor} />
        <circle cx={headX} cy={headY} r="12" className={styles.ring} />
        <circle cx={headX} cy={headY} r="4.5" className={styles.head} />
      </svg>
    </figure>
  );
}
