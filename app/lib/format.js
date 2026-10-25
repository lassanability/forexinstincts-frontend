export const money = (value, currency = "USD") => {
  const number = Number(value ?? 0);
  return `${number < 0 ? "−" : ""}${currency === "USD" ? "$" : `${currency} `}${Math.abs(number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const signedMoney = (value, currency) => `${Number(value) > 0 ? "+" : ""}${money(value, currency)}`;

export const percent = (value, digits = 1) => `${(Number(value ?? 0) * 100).toFixed(digits)}%`;

export const rValue = (value) => `${Number(value) > 0 ? "+" : ""}${Number(value ?? 0).toFixed(2)}R`;

export const toneOf = (value) => (Number(value) > 0 ? "up" : Number(value) < 0 ? "down" : "flat");

export const shortDate = (value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export const longDate = (value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const clockTime = (value) => new Date(value).toISOString().slice(11, 16);

export const timeAgo = (value) => {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const durationOf = (seconds) => (seconds >= 3600 ? `${seconds / 3600}h` : `${seconds / 60}m`);
