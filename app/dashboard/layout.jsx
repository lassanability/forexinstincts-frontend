export const metadata = {
  title: "Dashboard — My Trading Bots | ForexInstincts",
  description: "Manage and download your generated trading bots. View bot status, download MT4/MT5 files, and build new automated trading bots.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}
