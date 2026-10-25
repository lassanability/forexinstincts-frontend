"use client";

import { useEffect, useState } from "react";
import CandleChart from "@/app/components/charts/CandleChart";
import { subscribe } from "@/app/lib/derivFeed";

const HISTORY = 160;

const toCandle = (raw) => ({ time: Number(raw.open_time ?? raw.epoch), open: Number(raw.open), high: Number(raw.high), low: Number(raw.low), close: Number(raw.close) });

export default function LiveChart({ symbol, granularity = 60, size = "md", markers }) {
  const [candles, setCandles] = useState([]);

  useEffect(
    () =>
      subscribe({ ticks_history: symbol, style: "candles", granularity, count: HISTORY, end: "latest", adjust_start_time: 1 }, (message) => {
        if (message.candles) return setCandles(message.candles.map(toCandle));
        if (!message.ohlc) return;
        const bar = toCandle(message.ohlc);
        setCandles((current) => (current.at(-1)?.time === bar.time ? [...current.slice(0, -1), bar] : [...current.slice(-HISTORY + 1), bar]));
      }),
    [symbol, granularity]
  );

  return <CandleChart candles={candles} markers={markers} size={size} label={`${symbol} live chart`} />;
}
