const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Multi-Platform Trading Terminal",
  description:
    "Backtest your forex strategy with real OHLCV data, trade live via Capital.com or OANDA, run Pine Script bots on TradingView, or deploy an Expert Advisor in MetaTrader 4/5. ForexInstincts all-in-one trading terminal.",
  keywords: [
    "forex terminal",
    "Capital.com web trading",
    "OANDA web trading",
    "MT4 MT5 bot",
    "Pine Script bot",
    "forex backtest",
    "TradingView Pine Script",
    "forex strategy tester",
    "Expert Advisor online",
    "demo account trading",
    "OANDA forex",
    "Capital.com forex",
  ],
  alternates: { canonical: `${SITE_URL}/terminal` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/terminal`,
    title: "Live Trading Terminal | ForexInstincts",
    description:
      "Professional forex charting and trading terminal. Connect your broker, backtest your bot, and trade directly on ForexInstincts.",
    images: [{ url: `${SITE_URL}/assets/banner.png`, width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function TerminalLayout({ children }) {
  return children;
}
