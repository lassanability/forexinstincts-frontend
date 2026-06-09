export const metadata = {
  title: {
    template: "%s | ForexInstincts Blog",
    default: "Blog | ForexInstincts",
  },
  description: "Trading insights, forex bot guides, risk management tips, and platform updates from ForexInstincts.",
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
