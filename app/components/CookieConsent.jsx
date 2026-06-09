"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/style/cookieConsent.module.css";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p>
            We use local storage to keep you signed in and save your preferences.
            No third-party tracking.{" "}
            <Link href="/privacy">Learn more</Link>.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.declineBtn} onClick={decline}>Decline</button>
          <button className={styles.acceptBtn} onClick={accept}>Accept</button>
        </div>
      </div>
    </div>
  );
}
