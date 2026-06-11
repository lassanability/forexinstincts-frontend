import NewsSection from "@/app/components/NewsSection";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Platform News — Updates, Announcements & Market News",
  description: "Stay up to date with the latest ForexInstincts platform updates, new bot features, MetaTrader announcements, and forex market news.",
  keywords: [
    "forexinstincts news",
    "forex platform updates",
    "MetaTrader news",
    "trading bot updates",
    "forex market announcements",
    "EA builder updates",
    "automated trading news",
    "MT4 MT5 updates",
  ],
  alternates: { canonical: `${SITE_URL}/news` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/news`,
    title: "Platform News & Updates | ForexInstincts",
    description: "Latest ForexInstincts platform updates, new features, and forex market news.",
    images: [{ url: `${SITE_URL}/assets/banner.png`, width: 1200, height: 630, alt: "ForexInstincts News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform News & Updates — ForexInstincts",
    description: "Latest ForexInstincts platform updates, new features, and forex market news.",
    images: [`${SITE_URL}/assets/banner.png`],
  },
};

export default function NewsPage() {
  return <NewsSection />;
}
