const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Contact Us | ForexInstincts Support",
  description: "Get in touch with the ForexInstincts team for bot inquiries, payment issues, download support, or custom strategy requests. We respond within 24 hours.",

  keywords: [
    "ForexInstincts contact",
    "forex bot support",
    "MetaTrader EA support",
    "trading bot help",
    "EA download support",
    "crypto payment support",
    "MQL4 MQL5 support",
    "custom bot request",
    "forex automation support",
    "ForexInstincts email"
  ],

  openGraph: {
    title: "Contact Us | ForexInstincts Support",
    description: "Need help with your trading bot? Our support team responds within 24 hours. Reach us on Telegram @forexinstincts or via email.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us | ForexInstincts Support",
    description: "Need help with your trading bot? Reach us on Telegram @forexinstincts or via email.",
  },

  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
