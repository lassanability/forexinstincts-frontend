const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Terms of Use - Service Terms & Conditions",
  description: "Read ForexInstincts' terms of use. Understand your rights and responsibilities when using our forex bot builder, tiers, and services.",

  keywords: [
    "ForexInstincts terms",
    "terms of use",
    "service terms",
    "terms and conditions",
    "user agreement",
    "legal terms",
    "subscription terms",
    "refund policy",
    "intellectual property"
  ],

  openGraph: {
    title: "Terms of Use | ForexInstincts",
    description: "Review ForexInstincts' terms of use and service conditions.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Terms of Use | ForexInstincts",
    description: "Review ForexInstincts' terms of use and service conditions.",
  },

  alternates: {
    canonical: `${SITE_URL}/terms`,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }) {
  return <>{children}</>;
}
