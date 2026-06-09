import { Toaster } from "sonner";
import "@/app/style/global.css";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import GlobalLoader from "@/app/components/GlobalLoader";
import CookieConsent from "@/app/components/CookieConsent";
import styles from "@/app/style/applayout.module.css";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { StoreInitializer } from "@/app/components/StoreInitializer";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const sora = Sora({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forexinstincts.com";
const SITE_NAME = "ForexInstincts";
const TITLE_DEFAULT = "ForexInstincts — Custom Forex Trading Bot Generator";
const DESCRIPTION =
  "Build your own automated trading bot in minutes. Configure strategy, indicators, risk management, and more — get professional MQL4/MQL5 bot code generated instantly.";
const BANNER_URL = `${SITE_URL}/assets/banner.png`;

export const viewport = {
  themeColor: "#0b0f1a",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: TITLE_DEFAULT,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "forex trading bot",
    "expert advisor generator",
    "MQL4 EA",
    "MQL5 EA",
    "MetaTrader bot",
    "custom trading bot",
    "forex robot",
    "automated trading",
    "EA builder",
    "ForexInstincts",
    "forex automation",
    "algorithmic trading",
    "MT4 bot",
    "MT5 bot",
    "trading strategy builder",
    "no code trading bot",
  ],

  referrer: "origin-when-cross-origin",
  creator: SITE_NAME,
  publisher: SITE_NAME,

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [
      {
        url: BANNER_URL,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Forex Trading Bot Generator`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    images: [BANNER_URL],
    creator: "@forexinstincts",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description: DESCRIPTION,
  email: "support@forexinstincts.com",
  sameAs: [
    "https://twitter.com/forexinstincts",
    "https://www.facebook.com/forexinstincts",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@forexinstincts.com",
    contactType: "Customer Support",
    url: SITE_URL,
    areaServed: "Worldwide",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ForexInstincts Bot Builder",
  url: `${SITE_URL}/buildbot`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "0",
    offerCount: "3",
  },
  description: "Build custom MetaTrader Expert Advisors with no coding. Configure strategy, indicators, risk management and get MQL4/MQL5 bot code instantly.",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      </head>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrains.variable} ${inter.className}`}
        suppressHydrationWarning
      >
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement(
                  { pageLanguage: 'en', autoDisplay: false },
                  'google_translate_element'
                );
              }
            `,
          }}
        />
        <Script
          id="google-translate-script"
          strategy="afterInteractive"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        />

        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#111c2d",
              color: "#00c896",
              borderRadius: "15px",
             border: "1px solid rgba(0, 200, 150, 0.35)",
            },
          }}
        />
        <GlobalLoader />
        <CookieConsent />
        <div className={styles.appLayout}>
          <Navbar />
          <StoreInitializer>{children}</StoreInitializer>
          <Footer />
        </div>
      </body>
    </html>
  );
}
