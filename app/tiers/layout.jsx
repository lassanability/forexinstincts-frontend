const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Bot Pricing — Choose Your Bot Tier | ForexInstincts",
  description: "One-time payment per bot. Professional MetaTrader EA generated instantly. Choose from Basic, Complex, or Advanced bot tiers for your trading strategy.",

  keywords: [
    "forex bot pricing",
    "MetaTrader EA pricing",
    "trading bot tiers",
    "MQL4 MQL5 generator price",
    "expert advisor cost",
    "automated trading bot price",
    "forex EA generator",
    "MT4 bot pricing",
    "MT5 bot pricing",
    "forex trading automation"
  ],

  openGraph: {
    title: "Bot Pricing — Choose Your Bot Tier | ForexInstincts",
    description: "One-time payment per bot. Professional MQL4/MQL5 trading bot generated instantly. Basic, Complex, and Advanced tiers available.",
    url: `${SITE_URL}/tiers`,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Bot Pricing — Choose Your Bot Tier | ForexInstincts",
    description: "One-time payment per bot. Professional MQL4/MQL5 trading bot generated instantly.",
  },

  alternates: {
    canonical: `${SITE_URL}/tiers`,
  },
};

export default function TiersLayout({ children }) {
  return <>{children}</>;
}
