import HomeSection from "@/app/components/HomeSection";
import MiddleSection from "@/app/components/MiddleSection";
import NewsPreviewSection from "@/app/components/NewsPreviewSection";
import BlogPreviewSection from "@/app/components/BlogPreviewSection";
import Testimonials from "@/app/components/Testimonials";
import QuoteSection from "@/app/components/QuoteSection";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Build Custom Forex Trading Bots — MT4 & MT5 EA Generator",
  description: "Create professional MetaTrader Expert Advisors in minutes. Configure indicators, risk management, session filters and strategy — get clean MQL4/MQL5 bot code instantly. No coding required.",
  keywords: ["forex bot builder", "expert advisor generator", "MT4 EA maker", "MT5 expert advisor", "custom forex robot", "MQL4 generator", "MQL5 generator", "automated trading bot", "forex trading automation", "no code EA builder"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Build Custom Forex Trading Bots — MT4 & MT5 EA Generator",
    description: "Create professional MetaTrader Expert Advisors in minutes. Configure your strategy, indicators, and risk settings — bot code generated instantly after payment.",
    images: [{ url: `${SITE_URL}/banner.png`, width: 1200, height: 630, alt: "ForexInstincts — Custom Forex Bot Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Custom Forex Trading Bots — MT4 & MT5",
    description: "Professional EA code generated instantly from your strategy configuration. No coding required.",
    images: [`${SITE_URL}/banner.png`],
  },
};

export default function Home() {
  return (
    <main>
      <HomeSection />
      <MiddleSection />
      <NewsPreviewSection />
      <BlogPreviewSection />
      <Testimonials />
      <QuoteSection />
    </main>
  );
}
