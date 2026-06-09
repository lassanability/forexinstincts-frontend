const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Email Verification - Verify Your Account",
  description: "Verify your ForexInstincts account to unlock access to automated forex bot building.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: `${SITE_URL}/authentication/verification`,
  },
};

export default function VerificationLayout({ children }) {
  return <>{children}</>;
}
