const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Build Your Custom Forex Trading Bot",
  description: "Configure your MetaTrader Expert Advisor step by step. Choose symbol, timeframe, indicators, entry/exit rules, risk management and position sizing. Professional MQL4/MQL5 code generated and delivered instantly.",
  keywords: ["build forex bot", "custom EA wizard", "configure trading bot", "MetaTrader bot builder", "MQL4 MQL5 wizard", "forex automation setup"],
  alternates: { canonical: `${SITE_URL}/buildbot` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/buildbot`,
    title: "Build Your Custom Forex Trading Bot — ForexInstincts",
    description: "Step-by-step wizard to configure your strategy, indicators, risk settings, and more. Bot code generated instantly after payment.",
    images: [{ url: `${SITE_URL}/assets/banner.png`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function BuildBotLayout({ children }) {
  return children;
}
