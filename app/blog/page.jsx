import BlogSection from "@/app/components/BlogSection";

const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Trading Blog — Forex Strategies, EA Tips & Automation Guides",
  description: "Expert insights on forex trading strategies, MetaTrader expert advisor guides, risk management techniques, and automated trading tips from ForexInstincts.",
  keywords: [
    "forex trading blog",
    "expert advisor tips",
    "forex strategy guide",
    "MetaTrader automation",
    "MQL4 MQL5 tutorial",
    "automated trading guide",
    "forex risk management",
    "EA development blog",
    "forex bot guide",
    "trading system design",
  ],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Trading Blog — Forex Strategies & EA Guides | ForexInstincts",
    description: "Expert insights on forex trading strategies, expert advisor development, risk management, and automated trading.",
    images: [{ url: `${SITE_URL}/banner.png`, width: 1200, height: 630, alt: "ForexInstincts Trading Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trading Blog — Forex Strategies & EA Guides",
    description: "Expert insights on forex trading strategies, expert advisor development and automated trading.",
    images: [`${SITE_URL}/banner.png`],
  },
};

export default function BlogPage() {
  return <BlogSection />;
}
