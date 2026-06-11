const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "About Us — ForexInstincts | MetaTrader Bot Generator",
  description: "Learn how ForexInstincts helps traders build professional MetaTrader automated trading bots without writing code. One-time payment per bot, instant MQL4/MQL5 generation.",

  keywords: [
    "about ForexInstincts",
    "forex bot generator platform",
    "MetaTrader EA builder",
    "MQL4 MQL5 generator",
    "automated trading platform",
    "expert advisor builder",
    "forex automation",
    "no-code trading bot",
    "MT4 MT5 bot creator",
    "forex trading automation",
  ],

  alternates: { canonical: `${SITE_URL}/about` },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "About ForexInstincts — Professional MetaTrader EA Generator",
    description: "Build professional automated trading bots for MT4 and MT5 without writing a single line of code. One-time payment, instant generation.",
    images: [{ url: `${SITE_URL}/assets/banner.png`, width: 1200, height: 630, alt: "About ForexInstincts" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "About ForexInstincts — Professional MetaTrader EA Generator",
    description: "Build professional automated trading bots for MT4 and MT5 without writing a single line of code.",
    images: [`${SITE_URL}/assets/banner.png`],
  },
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
