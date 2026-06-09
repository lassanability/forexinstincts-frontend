"use client";

import Link from "next/link";
import { LiquidGlass } from "@liquidglass/react";
import styles from "@/app/style/homeSection.module.css";
import {
  IoRocketOutline as RocketIcon,
  IoChevronForward as ChevronIcon,
  IoCodeSlash as CodeIcon,
  IoPulse as PulseIcon,
  IoShieldCheckmarkOutline as ShieldIcon,
  IoFlashOutline as FlashIcon,
  IoTimeOutline as TimeIcon,
} from "react-icons/io5";

export default function HomeSection() {
  return (
    <div className={styles.homeSection}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.badgeWrap}>
              <LiquidGlass borderRadius={999} blur={0.4} saturation={1.4} shadowIntensity={0.12} zIndex={10}>
                <div className={styles.badge}>
                  <CodeIcon className={styles.badgeIcon} />
                  <span>MetaTrader EA Generator MT4 &amp; MT5 Supported</span>
                </div>
              </LiquidGlass>
            </div>

            <h1 className={styles.heroTitle}>
              Build Your Trading Bot
              <br />
              <span className={styles.heroTitleGradient}>
                In Minutes, Not Months
              </span>
            </h1>

            <p className={styles.heroDescription}>
              Configure your <span>forex strategy</span> indicators, risk
              management, session filters, and more. Get a professional
              trading bot deployed to MT4/MT5 instantly.
            </p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h1>3</h1>
                <p>Bot Tiers</p>
              </div>
              <div className={styles.statCard}>
                <h1>MT4/5</h1>
                <p>Platforms</p>
              </div>
              <div className={styles.statCard}>
                <h1>100%</h1>
                <p>Custom Built</p>
              </div>
            </div>

            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <ShieldIcon className={styles.trustIconGreen} />
                <div className={styles.trustTextFull}>One-time payment</div>
                <div className={styles.trustTextShort}>Prepaid</div>
              </div>
              <div className={styles.trustItem}>
                <FlashIcon className={styles.trustIconPurple} />
                <div className={styles.trustTextFull}>Instant generation</div>
                <div className={styles.trustTextShort}>Instant</div>
              </div>
              <div className={styles.trustItem}>
                <TimeIcon className={styles.trustIconPink} />
                <div className={styles.trustTextFull}>Ready in minutes</div>
                <div className={styles.trustTextShort}>Minutes</div>
              </div>
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.imageWrapper}>
              <div className={styles.codePreview}>
                <div className={styles.codeHeader}>
                  <div className={styles.codeDot} />
                  <div className={styles.codeDot} />
                  <div className={styles.codeDot} />
                  <span className={styles.codeFilename}>MyBot.mq5</span>
                </div>
                <div className={styles.codeBody}>
                  <pre>{`//+---------------------------+
//| ForexInstincts EA v1.0    |
//+---------------------------+
input string Symbol = "EURUSD";
input ENUM_TIMEFRAMES TF = PERIOD_H1;
input double RiskPercent = 1.5;
input int MagicNumber = 202401;

double entryPrice, stopLoss;

int OnInit() {
   return(INIT_SUCCEEDED);
}

void OnTick() {
   if(NewBar()) {
     CheckEntry();
   }
}`}</pre>
                </div>
              </div>

              <div className={styles.floatingCard}>
                <LiquidGlass borderRadius={20} blur={0.5} saturation={1.3} shadowIntensity={0.18} zIndex={10}>
                  <div className={styles.floatingCardContent}>
                    <div className={styles.cardHeader}>
                      <PulseIcon className={styles.cardPulse} />
                      <span className={styles.cardTitle}>Bot Generated</span>
                      <span className={styles.cardBadge}>✓ Ready</span>
                    </div>
                    <div className={styles.cardSubtitle}>EURUSD • H1 • RSI+MA</div>
                    <div className={styles.cardValue}>Download EA</div>
                  </div>
                </LiquidGlass>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
