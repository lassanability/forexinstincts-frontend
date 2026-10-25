import Link from "next/link";
import { TbLayoutDashboard, TbMenu2, TbRocket } from "react-icons/tb";
import Logo from "@/app/components/layout/Logo";
import ButtonLink from "@/app/components/ui/ButtonLink";
import { isSignedIn } from "@/app/lib/session";
import styles from "@/app/styles/navbar.module.css";

const LINKS = [
  { href: "/strategies", label: "Strategies" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/plans", label: "Plans" },
  { href: "/blog", label: "Learn" },
];

export default async function Navbar() {
  const signedIn = await isSignedIn();

  return (
    <header className={styles.bar}>
      <div className={`glass ${styles.inner}`}>
        <Logo />
        <nav className={styles.links} aria-label="Main">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          {signedIn ? (
            <ButtonLink href="/dashboard" size="sm" icon={TbLayoutDashboard}>
              Open dashboard
            </ButtonLink>
          ) : (
            <>
              <Link href="/login" className={styles.signIn}>
                Sign in
              </Link>
              <ButtonLink href="/dashboard" size="sm" icon={TbRocket}>
                Launch terminal
              </ButtonLink>
            </>
          )}
          <details className={styles.menu}>
            <summary aria-label="Menu">
              <TbMenu2 aria-hidden="true" />
            </summary>
            <div className={`glass ${styles.sheet}`}>
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              {!signedIn && <Link href="/login">Sign in</Link>}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
