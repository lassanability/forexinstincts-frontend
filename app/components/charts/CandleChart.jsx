"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/app/lib/cx";
import styles from "@/app/styles/candleChart.module.css";

const COLORS = { up: "#1fe0a9", down: "#ff4d6d", grid: "rgba(160, 220, 255, 0.07)", text: "#627a89", line: "#2bd9ff" };
const PAD = { top: 16, right: 64, bottom: 22, left: 8 };
const GRID_ROWS = 5;
const MIN_BODY = 1;

const draw = (canvas, candles, markers) => {
  const ratio = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);
  if (candles.length === 0) return;

  const plotWidth = width - PAD.left - PAD.right;
  const plotHeight = height - PAD.top - PAD.bottom;
  const slot = Math.max(plotWidth / candles.length, 2);
  const shown = candles.slice(-Math.floor(plotWidth / Math.max(slot, 4)));
  const step = plotWidth / shown.length;
  const high = Math.max(...shown.map((candle) => candle.high));
  const low = Math.min(...shown.map((candle) => candle.low));
  const span = high - low || high * 0.001 || 1;
  const y = (price) => PAD.top + ((high - price) / span) * plotHeight;
  const digits = span < 0.1 ? 5 : span < 10 ? 3 : 2;

  context.font = "11px ui-monospace, monospace";
  context.textAlign = "left";
  for (let row = 0; row <= GRID_ROWS; row += 1) {
    const price = high - (span * row) / GRID_ROWS;
    const lineY = y(price);
    context.strokeStyle = COLORS.grid;
    context.beginPath();
    context.moveTo(PAD.left, lineY);
    context.lineTo(width - PAD.right, lineY);
    context.stroke();
    context.fillStyle = COLORS.text;
    context.fillText(price.toFixed(digits), width - PAD.right + 8, lineY + 4);
  }

  shown.forEach((candle, index) => {
    const x = PAD.left + index * step + step / 2;
    const color = candle.close >= candle.open ? COLORS.up : COLORS.down;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x, y(candle.high));
    context.lineTo(x, y(candle.low));
    context.stroke();
    const top = y(Math.max(candle.open, candle.close));
    const body = Math.max(Math.abs(y(candle.open) - y(candle.close)), MIN_BODY);
    context.fillRect(x - Math.max(step * 0.32, 1), top, Math.max(step * 0.64, 2), body);
  });

  for (const marker of markers) {
    const index = shown.findIndex((candle) => candle.time >= marker.time);
    if (index < 0 || marker.price < low || marker.price > high) continue;
    const x = PAD.left + index * step + step / 2;
    context.fillStyle = marker.side === "buy" ? COLORS.up : COLORS.down;
    context.beginPath();
    context.arc(x, y(marker.price), 4, 0, Math.PI * 2);
    context.fill();
  }

  const last = shown.at(-1).close;
  context.setLineDash([4, 4]);
  context.strokeStyle = COLORS.line;
  context.beginPath();
  context.moveTo(PAD.left, y(last));
  context.lineTo(width - PAD.right, y(last));
  context.stroke();
  context.setLineDash([]);
  context.fillStyle = COLORS.line;
  context.fillRect(width - PAD.right + 2, y(last) - 9, PAD.right - 4, 18);
  context.fillStyle = "#02130e";
  context.fillText(last.toFixed(digits), width - PAD.right + 6, y(last) + 4);
};

export default function CandleChart({ candles, markers = [], size = "md", label }) {
  const canvas = useRef(null);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return undefined;
    draw(node, candles, markers);
    const observer = new ResizeObserver(() => draw(node, candles, markers));
    observer.observe(node);
    return () => observer.disconnect();
  }, [candles, markers]);

  return <canvas ref={canvas} className={cx(styles.chart, styles[size])} role="img" aria-label={label ?? "Price chart"} />;
}
