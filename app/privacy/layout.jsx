const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description: "Read ForexInstincts' privacy policy. Learn how we collect, use, and protect your personal information, including payment security and your data rights.",

  keywords: [
    "ForexInstincts privacy policy",
    "data protection",
    "user privacy",
    "personal information security",
    "payment security",
    "data rights",
    "GDPR compliance",
    "user data protection"
  ],

  openGraph: {
    title: "Privacy Policy | ForexInstincts",
    description: "Learn how ForexInstincts protects your personal information and data privacy.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Privacy Policy | ForexInstincts",
    description: "Learn how ForexInstincts protects your personal information and data privacy.",
  },

  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({ children }) {
  return <>{children}</>;
}
