import HomeSection from "@/app/components/HomeSection";
import MiddleSection from "@/app/components/MiddleSection";
import NewsPreviewSection from "@/app/components/NewsPreviewSection";
import BlogPreviewSection from "@/app/components/BlogPreviewSection";
import Testimonials from "@/app/components/Testimonials";
import QuoteSection from "@/app/components/QuoteSection";
import AdvertsInit from "@/app/components/ads/AdvertsInit";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Build Custom Forex Trading Bots: MT4, MT5 & TradingView",
  description: "Create professional forex trading bots in minutes. Generate MT4/MT5 Expert Advisors or TradingView Pine Script bots, backtest your strategy with real OHLCV data, and deploy instantly. No coding required.",
  keywords: ["forex bot builder", "expert advisor generator", "MT4 EA maker", "MT5 expert advisor", "TradingView Pine Script bot", "custom forex robot", "MQL4 generator", "MQL5 generator", "automated trading bot", "forex trading automation", "no code EA builder", "forex backtesting", "Capital.com trading bot", "OANDA trading bot", "web trading bot"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Build Custom Forex Trading Bots: MT4, MT5 & TradingView",
    description: "Generate MT4/MT5 Expert Advisors or TradingView Pine Script bots from a guided wizard. Backtest your strategy, then deploy to MetaTrader or TradingView instantly.",
    images: [{ url: `${SITE_URL}/assets/banner.png`, width: 1200, height: 630, alt: "ForexInstincts Custom Forex Bot Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Custom Forex Trading Bots: MT4, MT5 & TradingView",
    description: "Generate MT4, MT5, or TradingView bots from your strategy config. Backtest with real data, deploy instantly. No coding required.",
    images: [`${SITE_URL}/assets/banner.png`],
  },
};

export default function Home() {
  return (
    <main>
      <AdvertsInit />
      <HomeSection />
      <MiddleSection />
      <NewsPreviewSection />
      <BlogPreviewSection />
      <Testimonials />
      <QuoteSection />
    </main>
  );
}
