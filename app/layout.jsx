import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import Toaster from "@/app/components/ui/Toaster";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";
import "@/app/styles/global.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const DESCRIPTION = "Server-side trading bots for Deriv: research-backed forex and gold strategies, honest backtests with real costs, and hard risk limits that actually stop.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Trading bots that keep running`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_NAME, description: DESCRIPTION, url: SITE_URL },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DESCRIPTION },
};

export const viewport = { themeColor: "#03060b", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
