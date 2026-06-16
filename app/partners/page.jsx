"use client";

import { useEffect } from "react";
import { useAdvertStore } from "@/app/store/AdvertStore";
import AdCard from "@/app/components/ads/AdCard";
import styles from "@/app/style/partners.module.css";

export default function PartnersPage() {
  const { ads, loaded, fetchAds } = useAdvertStore();

  useEffect(() => {
    if (!loaded) fetchAds();
  }, [loaded, fetchAds]);

  const partners = ads.filter((a) => a.isActive && a.affiliateLink);
  const leftBannerAd = ads.find((a) => a.isActive && a.affiliateLink && a.showPartnerBannerLeft);
  const rightBannerAd = ads.find((a) => a.isActive && a.affiliateLink && a.showPartnerBannerRight);

  return (
    <div className={styles.partnersPage}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroTag}>Affiliate Partners</div>
          <h1 className={styles.heroTitle}>
            Trusted <span>Partners</span>
          </h1>
          <p className={styles.heroDesc}>
            Brokers, VPS providers, and prop firms recommended by ForexInstincts, vetted tools built for MetaTrader traders who want to run their bots effectively.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.divider} />
        <div className={styles.partnersLayout}>
          {leftBannerAd && (
            <div className={styles.partnerSideCol}>
              <AdCard ad={leftBannerAd} variant="banner" />
            </div>
          )}
          <div className={styles.partnersGridArea}>
            <div className={styles.grid}>
              {partners.map((ad) => (
                <AdCard key={ad._id} ad={ad} variant="partner" />
              ))}
            </div>
          </div>
          {rightBannerAd && (
            <div className={styles.partnerSideCol}>
              <AdCard ad={rightBannerAd} variant="banner" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
