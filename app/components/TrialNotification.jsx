"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/store/AuthStore";
import styles from "@/app/style/trialNotification.module.css";

const DISMISS_KEY = "fi_trial_notif_dismissed";

export default function TrialNotification() {
  const { isAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isAuth) return;
    if (!pathname) return;
    if (pathname.startsWith("/authentication") || pathname.startsWith("/buildbot")) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, [isAuth, pathname]);

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch {}
    setVisible(false);
  };

  const handleCTA = () => {
    dismiss();
    router.push("/authentication/signup");
  };

  if (!visible || isAuth) return null;

  return (
    <div className={styles.notification}>
      <div className={styles.notifCard}>
        <button className={styles.notifCloseBtn} onClick={dismiss} aria-label="Dismiss notification">
          ×
        </button>
        <div className={styles.notifBadge}>
          <span>FREE TRIAL</span>
        </div>
        <div className={styles.notifBody}>
          <p>Generate a basic forex trading bot, completely free. Valid for 6 hours, no payment required.</p>
        </div>
        <button className={styles.notifCta} onClick={handleCTA}>
          <span>Create Account & Try Free</span>
        </button>
        <div className={styles.notifNote}>
          <span>Account required · Basic tier · 6h validity</span>
        </div>
      </div>
    </div>
  );
}
