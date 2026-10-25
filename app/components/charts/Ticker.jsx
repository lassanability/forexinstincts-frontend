"use client";

import { useEffect, useState } from "react";
import { cx } from "@/app/lib/cx";
import { subscribe } from "@/app/lib/derivFeed";
import styles from "@/app/styles/ticker.module.css";

const SYMBOLS = [
  { symbol: "frxEURUSD", label: "EUR/USD" },
  { symbol: "frxGBPUSD", label: "GBP/USD" },
  { symbol: "frxXAUUSD", label: "Gold" },
  { symbol: "frxUSDJPY", label: "USD/JPY" },
  { symbol: "R_100", label: "Volatility 100" },
  { symbol: "1HZ100V", label: "Volatility 100 (1s)" },
  { symbol: "BOOM1000", label: "Boom 1000" },
  { symbol: "R_50", label: "Volatility 50" },
];

export default function Ticker() {
  const [quotes, setQuotes] = useState({});

  useEffect(() => {
    const stops = SYMBOLS.map(({ symbol }) =>
      subscribe({ ticks: symbol }, (message) => {
        if (message.error) return setQuotes((current) => ({ ...current, [symbol]: { ...current[symbol], closed: true } }));
        if (!message.tick) return;
        setQuotes((current) => {
          const previous = current[symbol]?.quote;
          return { ...current, [symbol]: { quote: message.tick.quote, pip: message.tick.pip_size, move: previous === undefined ? 0 : Math.sign(message.tick.quote - previous) } };
        });
      })
    );
    return () => stops.forEach((stop) => stop());
  }, []);

  const items = SYMBOLS.map((item) => ({ ...item, ...quotes[item.symbol] }));

  return (
    <div className={styles.ticker} aria-label="Live prices">
      <div className={styles.track}>
        {[...items, ...items].map((item, index) => (
          <span key={`${item.symbol}-${index}`} className={styles.item} aria-hidden={index >= items.length}>
            <b>{item.label}</b>
            <span className={cx("mono", item.move > 0 && "up", item.move < 0 && "down")}>{item.closed ? "Closed" : item.quote !== undefined ? Number(item.quote).toFixed(item.pip ?? 2) : "···"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
