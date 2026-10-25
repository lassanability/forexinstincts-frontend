"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbBuildingStore, TbChartCandle, TbFlask, TbLayoutDashboard, TbLink, TbLogout, TbRobot, TbSettings, TbSparkles } from "react-icons/tb";
import { signOut } from "@/app/actions/auth";
import KillSwitch from "@/app/components/app/KillSwitch";
import LiveConnection from "@/app/components/app/LiveConnection";
import Logo from "@/app/components/layout/Logo";
import { cx } from "@/app/lib/cx";
import { useLive } from "@/app/stores/live";
import styles from "@/app/styles/appShell.module.css";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: TbLayoutDashboard, tab: true },
  { href: "/bots", label: "Bots", icon: TbRobot, tab: true },
  { href: "/terminal", label: "Terminal", icon: TbChartCandle, tab: true },
  { href: "/backtests", label: "Backtests", icon: TbFlask, tab: true },
  { href: "/marketplace", label: "Marketplace", icon: TbBuildingStore },
  { href: "/accounts", label: "Deriv accounts", icon: TbLink },
  { href: "/plans", label: "Plans", icon: TbSparkles },
  { href: "/settings", label: "Settings", icon: TbSettings, tab: true },
];

const STATUS = { online: "Live", offline: "Reconnecting", connecting: "Connecting" };

export default function AppShell({ user, children }) {
  const pathname = usePathname();
  const status = useLive((state) => state.status);
  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={styles.shell}>
      <LiveConnection />
      <aside className={cx("glass", styles.sidebar)}>
        <Logo href="/dashboard" />
        <nav className={styles.nav} aria-label="App">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={cx(styles.link, active(item.href) && styles.active)} aria-current={active(item.href) ? "page" : undefined}>
              <item.icon aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.plan}>
          <small className="faint">Plan</small>
          <strong className={styles.tier}>{user.access.tier}</strong>
          {user.access.tier === "free" && (
            <Link href="/plans" className={styles.upgrade}>
              Upgrade for real accounts →
            </Link>
          )}
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.top}>
          <span className={cx(styles.status, styles[status])}>
            <i aria-hidden="true" />
            {STATUS[status]}
          </span>
          <span className={cx("grow truncate", styles.user)}>{user.name || user.email}</span>
          <KillSwitch />
          <form action={signOut}>
            <button type="submit" className={styles.signOut} aria-label="Sign out">
              <TbLogout aria-hidden="true" />
            </button>
          </form>
        </header>
        <main className={styles.content}>{children}</main>
      </div>

      <nav className={cx("glass", styles.tabs)} aria-label="Quick">
        {NAV.filter((item) => item.tab).map((item) => (
          <Link key={item.href} href={item.href} className={cx(styles.tab, active(item.href) && styles.active)}>
            <item.icon aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
