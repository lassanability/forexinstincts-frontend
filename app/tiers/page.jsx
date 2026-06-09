import PricingGrid from "@/app/components/PricingGrid";
import styles from "@/app/style/tiers.module.css";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Pricing & Bot Tiers — Basic, Complex & Advanced EA Plans",
  description: "Choose your forex trading bot tier. Basic covers core strategies, Complex adds trailing stops and MT5 support, Advanced unlocks grid/martingale, multi-timeframe, and full custom logic. One-time payment per bot.",
  keywords: ["forex bot pricing", "EA builder plans", "trading bot tiers", "MT4 MT5 pricing", "expert advisor cost"],
  alternates: { canonical: `${SITE_URL}/tiers` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tiers`,
    title: "Pricing & Bot Tiers — ForexInstincts",
    description: "Three tiers — Basic, Complex, Advanced. One-time payment, instant bot generation. Configure your strategy and get professional EA code.",
    images: [{ url: `${SITE_URL}/banner.png`, width: 1200, height: 630 }],
  },
};

export default function TiersPage() {
  return (
    <div className={styles.container}>
      <PricingGrid />
    </div>
  );
}
