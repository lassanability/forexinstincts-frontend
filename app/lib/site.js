export const SITE_NAME = "ForexInstincts";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://forexinstincts.com").replace(/\/$/, "");

export const absolute = (path) => `${SITE_URL}${path}`;

export const RISK_LINE = "Trading carries a high risk of loss. Bots and backtests do not guarantee returns.";
