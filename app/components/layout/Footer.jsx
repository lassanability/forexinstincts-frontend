import Link from "next/link";
import Logo from "@/app/components/layout/Logo";
import { getConfig, getPages } from "@/app/lib/api";
import { RISK_LINE, SITE_NAME } from "@/app/lib/site";
import styles from "@/app/styles/footer.module.css";

const PRODUCT = [
  { href: "/strategies", label: "Strategies" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/plans", label: "Plans" },
  { href: "/dashboard", label: "Terminal" },
];

export default async function Footer() {
  const [config, pages] = await Promise.all([getConfig(), getPages()]);
  const legal = (pages ?? []).filter((page) => page.slug !== "contact");
  const links = config?.links ?? {};

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <p className="muted">Server-side trading bots for Deriv, built on current research and honest numbers.</p>
          {links.affiliates && (
            <a href={links.affiliates} className={styles.affiliate} target="_blank" rel="noreferrer">
              Earn as an affiliate →
            </a>
          )}
        </div>
        <nav className={styles.column} aria-label="Product">
          <strong>Product</strong>
          {PRODUCT.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className={styles.column} aria-label="Learn">
          <strong>Learn</strong>
          <Link href="/blog">Learn</Link>
          <Link href="/contact">Contact</Link>
          {links.telegram && <a href={links.telegram}>Telegram</a>}
          {links.youtube && <a href={links.youtube}>YouTube</a>}
        </nav>
        <nav className={styles.column} aria-label="Legal">
          <strong>Legal</strong>
          {legal.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`}>
              {page.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>{config?.disclaimer || RISK_LINE}</p>
        <small>
          © {new Date().getFullYear()} {SITE_NAME}. Not a broker. Trades run on your own Deriv account.
        </small>
      </div>
    </footer>
  );
}
