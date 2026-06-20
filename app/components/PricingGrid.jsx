"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import { IoCheckmark as CheckIcon, IoAdd as PlusIcon, IoRocketOutline as RocketIcon } from "react-icons/io5";
import { DURATION_OPTIONS, calculateBotPrice } from "@/app/lib/pricingUtils";
import styles from "@/app/style/tierConfigurator.module.css";

const TIER_ORDER = ["basic", "complex", "advanced"];

export default function PricingGrid() {
  const router = useRouter();
  const { isAuth, hasUsedTrial } = useAuthStore();
  const { tiers, tiersLoading, fetchTiers } = useOrderStore();
  const [tierIndex, setTierIndex] = useState(1);
  const [durationIndex, setDurationIndex] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  const sortedTiers = [...(tiers || [])].sort(
    (a, b) => TIER_ORDER.indexOf(a.name) - TIER_ORDER.indexOf(b.name)
  );
  const selectedTier = sortedTiers[tierIndex];
  const duration = DURATION_OPTIONS[durationIndex];

  useEffect(() => {
    if (selectedTier?.features?.length) {
      setSelectedFeatures(
        selectedTier.features
          .map(f => (typeof f === "string" ? f : f.name))
          .filter(Boolean)
      );
    }
  }, [tierIndex, selectedTier?._id]);

  const toggleFeature = (name) => {
    const total = (selectedTier?.features || []).length;
    const minSelected = Math.max(0, total - 2);
    setSelectedFeatures(prev => {
      if (prev.includes(name)) {
        if (prev.length <= minSelected) return prev;
        return prev.filter(n => n !== name);
      }
      return [...prev, name];
    });
  };

  const price = calculateBotPrice(
    selectedTier?.basePrice,
    selectedTier?.ratePerHour,
    selectedTier?.features,
    selectedFeatures,
    duration.hours
  );

  const handleBuild = () => {
    if (!selectedTier) return;
    const params = new URLSearchParams({ tier: selectedTier._id, duration: String(duration.hours) });
    if (selectedFeatures.length > 0) {
      params.set("features", selectedFeatures.map(encodeURIComponent).join(","));
    }
    const buildPath = `/buildbot?${params.toString()}`;
    if (!isAuth) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(buildPath)}`);
      return;
    }
    router.push(buildPath);
  };

  const handleTrial = () => {
    if (!isAuth) {
      router.push("/authentication/signup");
      return;
    }
    router.push("/buildbot?trial=true");
  };

  if (tiersLoading && !tiers?.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>Build Your Custom Forex Bot</h1>
          <p>One-time payment per bot, configure your requirements, pay once, trade.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.skeletonSection}>
            <div className={`${styles.skeletonLabel} skeleton`} />
            <div className={`${styles.skeletonTrackFull} skeleton`} />
          </div>
          <div className={styles.skeletonSection}>
            <div className={`${styles.skeletonLabel} skeleton`} />
            <div className={styles.sliderNodes}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={styles.sliderNode}>
                  <div className={styles.sliderDotSkeleton} />
                  <div className={styles.skeletonText} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.skeletonSection}>
            <div className={`${styles.skeletonLabel} skeleton`} />
            <div className={styles.skeletonFeatureGrid}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`${styles.skeletonFeature} skeleton`} />
              ))}
            </div>
          </div>
          <div className={styles.skeletonPriceRow}>
            <div className={`${styles.skeletonPrice} skeleton`} />
            <div className={`${styles.skeletonPriceNote} skeleton`} />
          </div>
          <div className={`${styles.skeletonBtn} skeleton`} />
        </div>

        <div className={styles.trialSection}>
          <div className={styles.trialCard}>
            <div className={styles.trialCardBadge}>
              <span>{isAuth && hasUsedTrial ? "USED" : "FREE"}</span>
            </div>
            <h3>Try Before You Buy</h3>
            <p>
              Generate a basic trading bot free of charge. Valid for 6 hours, no payment required.
              {!isAuth && " Create an account to get started."}
              {isAuth && hasUsedTrial && " You have already used your free trial."}
            </p>
            {isAuth && hasUsedTrial ? (
              <button className={styles.trialBtn} disabled>
                Trial Already Used
              </button>
            ) : (
              <button className={styles.trialBtn} onClick={handleTrial}>
                {isAuth ? "Start Free Trial" : "Create Account for Free Trial"}
              </button>
            )}
            <div className={styles.trialCardNote}>
              <span>Account required · Basic tier · 6h validity</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Build Your Custom Forex Bot</h1>
        <p>One-time payment per bot, configure your requirements, pay once, trade.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Bot Active Duration</span>
          </div>
          <div className={styles.durationSlider} data-step={durationIndex}>
            <div className={styles.durationTrack}>
              <div className={styles.durationFill} />
            </div>
            <input
              type="range"
              min="0"
              max={DURATION_OPTIONS.length - 1}
              step="1"
              value={durationIndex}
              onChange={e => setDurationIndex(Number(e.target.value))}
              className={styles.durationRange}
              aria-label="Bot active duration"
            />
            <div className={styles.durationLabels}>
              {DURATION_OPTIONS.map((d, i) => (
                <div
                  key={i}
                  className={`${styles.durationLabel}${durationIndex === i ? ` ${styles.durationLabelActive}` : ""}`}
                >
                  {d.label}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.durationSelected}>
            <span>Active for:</span>
            <div className={styles.durationSelectedValue}>{duration.fullLabel}</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span>Bot Complexity</span>
          </div>
          <div className={styles.sliderWrap} data-tier={tierIndex}>
            <div className={styles.sliderTrack}>
              <div className={styles.sliderFill} />
            </div>
            <div className={styles.sliderNodes}>
              {sortedTiers.length > 0
                ? sortedTiers.map((t, i) => (
                    <button
                      key={t._id}
                      type="button"
                      className={`${styles.sliderNode}${tierIndex >= i ? ` ${styles.sliderNodeActive}` : ""}`}
                      onClick={() => setTierIndex(i)}
                    >
                      <div className={styles.sliderDot} />
                      {t.displayName}
                    </button>
                  ))
                : TIER_ORDER.map(name => (
                    <button key={name} type="button" className={styles.sliderNode}>
                      <div className={styles.sliderDotSkeleton} />
                      <div className={styles.skeletonText} />
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {selectedTier && (selectedTier.features || []).length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>Features</span>
              <div className={styles.sectionHint}>Toggle to include or exclude</div>
            </div>
            <div className={styles.featureGrid}>
              {(selectedTier.features || []).map((f, i) => {
                const isOn = selectedFeatures.includes(f.name);
                return (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.featureToggle}${isOn ? ` ${styles.featureToggleOn}` : ""}`}
                    onClick={() => toggleFeature(f.name)}
                  >
                    <div className={`${styles.featureToggleIcon}${isOn ? ` ${styles.featureToggleIconOn}` : ""}`}>
                      {isOn ? <CheckIcon /> : <PlusIcon />}
                    </div>
                    <div className={styles.featureToggleName}>{f.name}</div>
                    <div className={styles.featureToggleMult}>×{f.multiplier}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.priceRow}>
          <div className={styles.priceAmount}>
            <span>$</span>
            <span>{price > 0 ? price.toLocaleString() : "—"}</span>
          </div>
          <div className={styles.priceNote}>
            <span>USD · one-time</span>
          </div>
        </div>

        <button
          className={styles.buildBtn}
          onClick={handleBuild}
          disabled={!selectedTier || !tiers?.length}
        >
          <RocketIcon />
          Configure Your Bot
        </button>

        <div className={styles.secureNote}>
          <span>Secure crypto payment · Bot generated instantly after confirmation</span>
        </div>
      </div>

      <div className={styles.trialSection}>
        <div className={styles.trialCard}>
          <div className={styles.trialCardBadge}>
            <span>{isAuth && hasUsedTrial ? "USED" : "FREE"}</span>
          </div>
          <h3>Try Before You Buy</h3>
          <p>
            Generate a basic trading bot free of charge. Valid for 6 hours, no payment required.
            {!isAuth && " Create an account to get started."}
            {isAuth && hasUsedTrial && " You have already used your free trial."}
          </p>
          {isAuth && hasUsedTrial ? (
            <button className={styles.trialBtn} disabled>
              Trial Already Used
            </button>
          ) : (
            <button className={styles.trialBtn} onClick={handleTrial}>
              {isAuth ? "Start Free Trial" : "Create Account for Free Trial"}
            </button>
          )}
          <div className={styles.trialCardNote}>
            <span>Account required · Basic tier · 6h validity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
