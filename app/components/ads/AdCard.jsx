"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppImage from "@/app/components/ui/AppImage";
import styles from "@/app/style/adCard.module.css";
import { IoOpenOutline as LinkIcon, IoClose as CloseIcon, IoChevronBack as PrevIcon, IoChevronForward as NextIcon } from "react-icons/io5";

function PartnerCard({ ad }) {
  return (
    <div className={styles.partnerCard}>
      <div className={styles.partnerCardHead}>
        <div className={styles.partnerLogoWrap}>
          <AppImage src={ad.logo} alt={ad.name} sizes="52px" />
        </div>
        <div className={styles.partnerCardBody}>
          <div className={styles.partnerName}>{ad.name}</div>
          {ad.bonus && <div className={styles.partnerBonus}>{ad.bonus}</div>}
        </div>
      </div>
      <Link href={ad.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" className={styles.partnerBtn}>
        Visit Partner
        <LinkIcon className={styles.partnerLinkIcon} />
      </Link>
    </div>
  );
}

const BANNER_SIZES = {
  "728x90":  "(max-width: 768px) 100vw, 728px",
  "300x250": "300px",
  "320x50":  "320px",
};

function BannerAd({ ad }) {
  if (!ad.bannerImage) return null;
  const size = ad.bannerSize || "728x90";
  return (
    <Link href={ad.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" className={styles.bannerWrap}>
      <div className={styles.bannerInner} data-size={size}>
        <AppImage src={ad.bannerImage} alt={ad.name} sizes={BANNER_SIZES[size] || BANNER_SIZES["728x90"]} />
      </div>
    </Link>
  );
}

function DashboardAdCard({ ad }) {
  return (
    <div className={styles.dashCard}>
      <div className={styles.dashLogoWrap}>
        <AppImage src={ad.logo} alt={ad.name} sizes="40px" />
      </div>
      <div className={styles.dashCardContent}>
        <div className={styles.dashCardName}>{ad.name}</div>
        {ad.bonus && <div className={styles.dashCardBonus}>{ad.bonus}</div>}
      </div>
      <Link href={ad.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" className={styles.dashCardBtn}>
        Open
      </Link>
    </div>
  );
}

function PopupAd({ ad, onClose, total, current, onPrev, onNext, onGoTo }) {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <button className={styles.popupClose} onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
        <div key={ad._id} className={styles.popupSlideContent}>
          {ad.advertImage && (
            <div className={styles.popupImageWrap}>
              <AppImage src={ad.advertImage} alt={ad.name} sizes="480px" />
            </div>
          )}
          <div className={styles.popupBody}>
            <div className={styles.popupHead}>
              <div className={styles.popupLogoWrap}>
                <AppImage src={ad.logo} alt={ad.name} sizes="44px" />
              </div>
              <div className={styles.popupHeadText}>
                <div className={styles.popupName}>{ad.name}</div>
                {ad.bonus && <div className={styles.popupBonus}>{ad.bonus}</div>}
              </div>
            </div>
            <div className={styles.popupActions}>
              <Link href={ad.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" className={styles.popupCta} onClick={onClose}>
                Get Offer
              </Link>
              <button className={styles.popupDismiss} onClick={onClose}>Maybe later</button>
            </div>
          </div>
        </div>
        {total > 1 && (
          <div className={styles.popupSliderNav}>
            <button className={styles.popupNavBtn} onClick={onPrev} aria-label="Previous ad">
              <PrevIcon />
            </button>
            <div className={styles.popupDots}>
              {Array.from({ length: total }, (_, i) => (
                <button
                  key={i}
                  className={i === current ? `${styles.popupDot} ${styles.popupDotActive}` : styles.popupDot}
                  onClick={() => onGoTo(i)}
                  aria-label={`Ad ${i + 1} of ${total}`}
                />
              ))}
            </div>
            <button className={styles.popupNavBtn} onClick={onNext} aria-label="Next ad">
              <NextIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BotSuccessAdCard({ ad }) {
  return (
    <div className={styles.botSuccessCard}>
      <div className={styles.botSuccessHead}>
        <div className={styles.botSuccessLogoWrap}>
          <AppImage src={ad.logo} alt={ad.name} sizes="48px" />
        </div>
        <div>
          <div className={styles.botSuccessLabel}>Recommended Broker</div>
          <div className={styles.botSuccessName}>{ad.name}</div>
        </div>
      </div>
      {ad.bonus && <div className={styles.botSuccessBonus}>{ad.bonus}</div>}
      <Link href={ad.affiliateLink} target="_blank" rel="noopener noreferrer sponsored" className={styles.botSuccessBtn}>
        Open Account <LinkIcon />
      </Link>
    </div>
  );
}

function IframeAd({ ad }) {
  if (!ad.iframeCode) return null;
  return (
    <div className={styles.iframeWrap}>
      <div
        className={styles.iframeInner}
        dangerouslySetInnerHTML={{ __html: ad.iframeCode }}
      />
    </div>
  );
}

export default function AdCard({ ad, variant }) {
  if (!ad || !ad.affiliateLink) return null;

  if (variant === "partner") return <PartnerCard ad={ad} />;
  if (variant === "banner") {
    if (ad.iframeCode) return <IframeAd ad={ad} />;
    return <BannerAd ad={ad} />;
  }
  if (variant === "dashboard") return <DashboardAdCard ad={ad} />;
  if (variant === "botSuccess") return <BotSuccessAdCard ad={ad} />;
  if (variant === "iframe") return <IframeAd ad={ad} />;
  return null;
}

export function AdPopupController({ ads }) {
  const [dismissed, setDismissed] = useState(false);
  const [current, setCurrent] = useState(0);
  const popups = ads.filter((a) => a.showPopup);
  const total = popups.length;

  useEffect(() => {
    if (total <= 1 || dismissed) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % total), 4500);
    return () => clearInterval(id);
  }, [current, total, dismissed]);

  if (!total || dismissed) return null;
  const ad = popups[current];
  const prev = () => setCurrent((i) => (i - 1 + total) % total);
  const next = () => setCurrent((i) => (i + 1) % total);
  return (
    <PopupAd
      ad={ad}
      onClose={() => setDismissed(true)}
      total={total}
      current={current}
      onPrev={prev}
      onNext={next}
      onGoTo={setCurrent}
    />
  );
}
