const SITE_URL = "https://forexinstincts.com";

export const metadata = {
  title: "Reset Password - Recover Your Account",
  description: "Reset your ForexInstincts password to regain access to your account and trading bots.",

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: `${SITE_URL}/authentication/resetcode`,
  },
};

export default function ResetCodeLayout({ children }) {
  return <>{children}</>;
}
