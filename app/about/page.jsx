"use client";

import { useEffect } from "react";
import { LiquidGlass } from "@liquidglass/react";
import styles from "@/app/style/info.module.css";
import aboutStyles from "@/app/style/about.module.css";
import {
  IoRocketOutline as RocketIcon,
  IoShieldCheckmarkOutline as ShieldIcon,
  IoCodeSlash as CodeIcon,
  IoStarOutline as StarIcon,
  IoCashOutline as CashIcon,
  IoTrendingUpOutline as TrendingIcon,
  IoCheckmarkCircleOutline as CheckIcon,
} from "react-icons/io5";

const STATS = [
  { value: "3", label: "Bot Tiers", icon: <StarIcon /> },
  { value: "MT4+5", label: "Platforms", icon: <CodeIcon /> },
  { value: "100%", label: "Custom Built", icon: <ShieldIcon /> },
  { value: "1×", label: "Pay Once, Keep Forever", icon: <CashIcon /> },
];

const SECTIONS = [
  {
    icon: <RocketIcon />,
    heading: "About ForexInstincts",
    content:
      "ForexInstincts is your go-to platform for building professional MetaTrader trading bots — no coding required. We specialize in generating custom MQL4 and MQL5 trading bots that implement your exact strategy. Whether you are a scalper, swing trader, or position trader, our bot builder translates your risk rules, entry signals, and exit conditions into production-ready trading bot code compatible with MetaTrader 4 and MetaTrader 5.",
  },
  {
    icon: <ShieldIcon />,
    heading: "Why Choose ForexInstincts?",
    content:
      "At ForexInstincts, we believe every trader deserves institutional-grade automation tools regardless of their coding background. Our platform handles the full MQL development lifecycle — from parameter configuration to code generation — so you can focus on strategy, not syntax. Each bot is generated fresh for your exact specifications and delivered as a downloadable .ex4 or .ex5 file ready to attach to any chart.",
  },
  {
    icon: <CodeIcon />,
    heading: "How the Bot Builder Works",
    content:
      "Building a bot takes minutes, not months. You walk through a guided six-step wizard that captures every aspect of your strategy:",
    bullets: [
      "Basic Info — choose your trading pair, timeframe, platform, and bot name",
      "Risk Management — configure lot sizing, maximum open trades, and daily trade limits",
      "Entry Strategy — select your primary signal (MA crossover, RSI, MACD, Bollinger Bands, or Price Action) and add filters",
      "Protection — set take profit, stop loss, trailing stop, and break-even rules",
      "Advanced Options — multi-timeframe analysis, martingale, grid trading, and notification settings",
      "Review and Pay — confirm your configuration and pay once via Paystack to trigger generation",
    ],
  },
  {
    icon: <TrendingIcon />,
    heading: "The Importance of Automated Trading",
    content:
      "Manual trading is limited by emotions, fatigue, and the number of charts a human can monitor simultaneously. A well-configured trading bot executes your rules with perfect consistency, 24 hours a day, five days a week — capturing opportunities you would otherwise miss. ForexInstincts gives every trader, from beginner to professional, the ability to systemise their edge and remove emotional decision-making from the equation.",
  },
  {
    icon: <CashIcon />,
    heading: "Simple One-Time Pricing",
    content:
      "ForexInstincts runs on a simple pay-per-bot model. Pay once for each bot you build — no recurring fees, no renewal charges, no licence servers. Your bot is yours to keep.",
  },
  {
    icon: <StarIcon />,
    heading: "Our Bot Tiers",
    content: "We offer three tiers to match your strategy complexity:",
    bullets: [
      "Basic — simple single-indicator strategies ideal for beginners and clean setups",
      "Complex — multi-indicator logic with additional filters and risk features",
      "Advanced — full-featured bots with multi-timeframe analysis, grid/martingale options, and maximum configurability",
    ],
    footer:
      "Each tier generates a complete, compilable MQL file — not a template or snippet. The code is clean, commented, and ready to run.",
  },
];

export default function About() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.info}>
      <div className={styles.infoHeader}>
        <h1>About ForexInstincts</h1>
      </div>

      <div className={aboutStyles.statsRow}>
        {STATS.map((stat, i) => (
          <div key={i} className={aboutStyles.statWrap}>
            <LiquidGlass borderRadius={20} blur={0.4} saturation={1.3} shadowIntensity={0.15} zIndex={10}>
              <div className={aboutStyles.statCard}>
                <span className={aboutStyles.statIcon}>{stat.icon}</span>
                <strong className={aboutStyles.statValue}>{stat.value}</strong>
                <span className={aboutStyles.statLabel}>{stat.label}</span>
              </div>
            </LiquidGlass>
          </div>
        ))}
      </div>

      {SECTIONS.map((sec, i) => (
        <div key={i} className={styles.section}>
          <h2>
            <span className={aboutStyles.sectionIcon}>{sec.icon}</span>
            {sec.heading}
          </h2>
          {sec.content && <p>{sec.content}</p>}
          {sec.bullets && (
            <ul className={styles.bulletList}>
              {sec.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          )}
          {sec.footer && <p>{sec.footer}</p>}
        </div>
      ))}

      <div className={styles.section}>
        <p>
          ForexInstincts is built for traders who want results. We handle the code so you can focus on the market. Start building your first trading bot today — it takes less than ten minutes from signup to download.
        </p>
      </div>
    </div>
  );
}
