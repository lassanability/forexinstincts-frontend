"use client";

import PricingGrid from "@/app/components/PricingGrid";
import styles from "@/app/style/middleSection.module.css";
import {
  IoShield as ShieldIcon,
  IoSparkles as SparklesIcon,
  IoCodeSlash as CodeIcon,
  IoDownload as DownloadIcon,
} from "react-icons/io5";
import { FaCrown as CrownIcon } from "react-icons/fa";

export default function MiddleSection() {
  const features = [
    {
      icon: <CodeIcon />,
      title: "Plug-and-Play EA File",
      description:
        "Receive a compiled, ready-to-upload EA file (.ex4/.ex5). Drop it into MetaTrader and start trading immediately — no setup, no coding.",
      stat: "Instant Deploy",
    },
    {
      icon: <ShieldIcon />,
      title: "Full Risk Control",
      description:
        "Built-in stop loss, take profit, trailing stops, break-even, and lot-based position sizing. Every trade protected.",
      stat: "SL · TP · Trailing",
    },
    {
      icon: <SparklesIcon />,
      title: "Multi-Indicator Signals",
      description:
        "MA crossovers, RSI, MACD, Bollinger Bands, Stochastic — select and combine signals to match your edge.",
      stat: "10+ Strategies",
    },
    {
      icon: <CrownIcon />,
      title: "Advanced Capabilities",
      description:
        "Multi-timeframe analysis, grid, martingale, session filters, and news avoidance. Full MT4 and MT5 support.",
      stat: "MT4 + MT5",
    },
  ];

  const steps = [
    {
      icon: <CrownIcon />,
      title: "Choose Your Tier",
      description:
        "Select Basic, Complex, or Advanced. Each tier unlocks more features and strategy depth for your trading bot.",
    },
    {
      icon: <CodeIcon />,
      title: "Configure Your Bot",
      description:
        "Set your symbol, timeframe, strategy, indicators, risk parameters, and entry/exit rules using our guided wizard.",
    },
    {
      icon: <ShieldIcon />,
      title: "Pay & Generate",
      description:
        "Complete payment via Paystack. Your bot is generated immediately — professional EA code ready for MetaTrader.",
    },
    {
      icon: <DownloadIcon />,
      title: "Download & Trade",
      description:
        "Download your MT4 or MT5 EA file from your dashboard. Attach it to your chart and start trading.",
    },
  ];

  return (
    <section className={styles.middleSection}>
      <div className={styles.middleContainer}>
        <div className={styles.howItWorksSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionChip}>Step by Step</div>
            <h2>How It Works</h2>
            <p>From configuration to downloadable EA in four simple steps</p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionChip}>Every Bot Includes</div>
            <h2>Configured by You. Built for the Market.</h2>
            <p>Every EA is custom-built from your configuration and delivered as a ready-to-deploy file — professional strategy logic included.</p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIconPanel}>
                  <div className={styles.featureIconCircle}>
                    {feature.icon}
                  </div>
                </div>
                <div className={styles.featureCardBody}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className={styles.featureStat}>{feature.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.pricingSection}>
          <PricingGrid />
        </div>
      </div>
    </section>
  );
}
