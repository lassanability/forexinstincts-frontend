"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "@/app/style/mediakit.module.css";
import {
  IoDownloadOutline as DownloadIcon,
  IoHourglassOutline as LoadingIcon,
} from "react-icons/io5";

const PLATFORM_CARDS = [
  {
    emoji: "🤖",
    title: "EA Bot Builder",
    body: "A 6-step guided wizard lets traders configure strategy, indicators, risk management, and session filters. The platform generates clean MQL4/MQL5 code as a downloadable .ex4 or .ex5 file — no coding required.",
  },
  {
    emoji: "🏪",
    title: "Bot Marketplace",
    body: "Users can publish their generated bots to the marketplace for other traders to buy. 50% of every sale goes back to the original bot creator — turning a one-time build into passive recurring income.",
  },
  {
    emoji: "📰",
    title: "News & Blog",
    body: "Live forex market news and an educational blog covering trading strategies, EA setup guides, and market analysis — keeping traders on the platform beyond the initial bot build.",
  },
  {
    emoji: "💰",
    title: "Referral & Wallet System",
    body: "A built-in referral programme with tiered commission rates rewards users for bringing others to the platform — compounding growth and community loyalty over time.",
  },
];

const STATS = [
  { val: "MT4 + MT5", label: "Platforms" },
  { val: "3 Tiers", label: "Bot Complexity" },
  { val: "MQL4/5", label: "Code Output" },
  { val: "1× Payment", label: "No Subscription" },
  { val: "6 Steps", label: "Build Wizard" },
];

const TIERS = [
  {
    name: "Basic",
    tag: "Single-indicator",
    featured: false,
    features: [
      "MA Crossover, RSI, MACD, Bollinger Bands, Stochastic",
      "Price Action breakout & candlestick patterns",
      "Fixed lot sizing · Take profit & stop loss",
      "MT4 or MT5 output",
    ],
  },
  {
    name: "Complex",
    tag: "Multi-indicator",
    featured: true,
    features: [
      "Multi-indicator logic with AND/OR filters",
      "Trailing stop & break-even rules",
      "Session time filters & multi-timeframe analysis",
      "Additional confirmation indicators",
    ],
  },
  {
    name: "Advanced",
    tag: "Full-featured",
    featured: false,
    features: [
      "Everything in Complex, plus:",
      "Martingale & grid trading options",
      "Maximum strategy configurability — all signal types unlocked",
      "Push & email trade notifications",
    ],
  },
];

const AUDIENCE = [
  {
    emoji: "📈",
    title: "Retail Forex Traders",
    body: "Active traders on MetaTrader 4 and MetaTrader 5 — the world's most widely used retail trading platforms. These users already have broker accounts and are actively placing trades.",
  },
  {
    emoji: "🤖",
    title: "Algo & EA Enthusiasts",
    body: "Traders who want to automate their manual strategy without writing code. A rapidly growing segment as algorithmic trading moves into mainstream retail markets.",
  },
  {
    emoji: "🏦",
    title: "Prop Firm Challengers",
    body: "Traders using EAs to pass FTMO, The5ers, and similar prop firm challenges. The prop trading industry grew 45% YoY to $850M in 2026 — and EA users are its core demographic.",
  },
  {
    emoji: "🌍",
    title: "Global Reach",
    body: "Our audience spans Africa, Asia, Europe, and the Americas — regions with the highest retail forex participation rates and fastest-growing broker client bases.",
  },
];

const TRAITS = [
  "100% MetaTrader users — every ForexInstincts user operates MT4 or MT5, making broker and VPS affiliate offers directly relevant to their workflow.",
  "High purchase intent — users have already paid for a bot. They are committed traders actively seeking brokers, VPS hosting, and prop firm accounts.",
  "Bot-first mindset — traders who automate their strategies are more disciplined and consistent, leading to higher lifetime value for broker affiliates.",
  "Marketplace repeat visits — the bot marketplace and referral system drive sustained engagement beyond the initial platform transaction.",
];

const PLACEMENTS = [
  {
    num: "01",
    title: "Bot Download Screen",
    body: "Immediately after a user downloads their generated bot, a contextual recommendation is displayed to run it 24/7 via a recommended VPS provider or open a live account with a partner broker — the highest-intent moment in the user journey.",
  },
  {
    num: "02",
    title: "Build Wizard — Step 1",
    body: "Users select a trading pair and platform during configuration. This is a natural placement for broker partners whose accounts support the selected instruments.",
  },
  {
    num: "03",
    title: "Dashboard Sidebar",
    body: "Logged-in users return to their dashboard to manage their active bots. A persistent sidebar panel surfaces affiliate offers in direct context with the user's live trading tools.",
  },
  {
    num: "04",
    title: "Blog & News Articles",
    body: "The blog and news sections target traders researching setups and strategies. Partner mentions, embedded affiliate links, and sponsored content reach a highly engaged reading audience.",
  },
  {
    num: "05",
    title: "Bot Marketplace",
    body: "Every bot listing includes a 'Run this bot live' call-to-action linking to recommended broker and VPS partners — targeting buyers who are ready to deploy immediately.",
  },
  {
    num: "06",
    title: "Dedicated Partners Page",
    body: "A curated /partners page lists recommended brokers, VPS providers, and prop firms as trusted community tools — presented as first-party recommendations, not banner advertising.",
  },
];

const WHY = [
  {
    title: "Zero cold traffic.",
    body: "Every ForexInstincts user has already paid for a custom bot. These are committed traders — not casual visitors browsing trading content.",
  },
  {
    title: "100% MT4 & MT5 audience.",
    body: "Our entire user base operates on MetaTrader — the same platform supported by virtually every forex broker and VPS provider running an affiliate programme.",
  },
  {
    title: "Contextual relevance.",
    body: "Broker, VPS, and prop firm offers are not interruptions on ForexInstincts. They are natural next steps directly within the user's bot deployment workflow.",
  },
  {
    title: "Compounding engagement.",
    body: "The marketplace, referral system, and blog content bring users back repeatedly — giving partner placements extended exposure across multiple sessions.",
  },
];

export default function MediaKitPage() {
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(contentRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0b0f1a",
        scrollY: -window.scrollY,
        windowWidth: 900,
        logging: false,
        imageTimeout: 0,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;

      let offsetY = 0;
      let remaining = imgH;
      let first = true;

      while (remaining > 0) {
        if (!first) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, offsetY, pageW, imgH, undefined, "FAST");
        offsetY -= pageH;
        remaining -= pageH;
        first = false;
      }

      pdf.save("ForexInstincts-MediaKit.pdf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarBrand}>
          <div className={styles.toolbarLogo}>
            <Image src="/assets/whitelogo.png" alt="ForexInstincts" width={22} height={22} />
          </div>
          <div className={styles.toolbarName}>
            <span>Forex</span>Instincts — Media Kit
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.toolbarLabel}>Download for affiliate applications</div>
          <button className={styles.downloadBtn} onClick={handleDownload} disabled={loading}>
            {loading ? <LoadingIcon className={styles.downloadIcon} /> : <DownloadIcon className={styles.downloadIcon} />}
            {loading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div ref={contentRef} className={styles.kitContent}>
        <div className={styles.cover}>
          <div className={`${styles.coverOrb} ${styles.coverOrb1}`} />
          <div className={`${styles.coverOrb} ${styles.coverOrb2}`} />
          <div className={styles.coverInner}>
            <div className={styles.kitBadge}>
              Media Kit &nbsp;·&nbsp; 2026
            </div>
            <div className={styles.coverLogoWrap}>
              <Image src="/assets/whitelogo.png" alt="ForexInstincts" width={48} height={48} />
            </div>
            <h1 className={styles.coverTitle}>
              <span>Forex</span>Instincts
            </h1>
            <p className={styles.coverTagline}>
              The professional platform for building MetaTrader Expert Advisors — no coding required. Trusted by forex traders who need production-ready MT4 &amp; MT5 bots on demand.
            </p>
            <div className={styles.coverDivider} />
            <div className={styles.coverStats}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.coverStat}>
                  <div className={styles.coverStatVal}>{s.val}</div>
                  <div className={styles.coverStatLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className={styles.coverMeta}>
              <div className={styles.coverMetaItem}>
                <span>Website</span>
                <span>forexinstincts.com</span>
              </div>
              <div className={styles.coverMetaDot} />
              <div className={styles.coverMetaItem}>
                <span>Niche</span>
                <span>Forex / Algo Trading</span>
              </div>
              <div className={styles.coverMetaDot} />
              <div className={styles.coverMetaItem}>
                <span>Contact</span>
                <span>support@forexinstincts.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            About the Platform
          </div>
          <h2 className={styles.sectionTitle}>
            What is <span>ForexInstincts?</span>
          </h2>
          <p className={styles.sectionBody}>
            ForexInstincts is a web platform that generates production-ready MetaTrader Expert Advisors (EAs) from a guided configuration wizard. Traders walk through six steps covering strategy, risk, entry signals, protection rules, and advanced options — and receive a compiled .ex4 or .ex5 file ready to attach to any MetaTrader chart. Each bot is generated fresh for the trader&apos;s exact specifications, not a template or snippet.
          </p>
          <div className={styles.platformGrid}>
            {PLATFORM_CARDS.map((c) => (
              <div key={c.title} className={styles.platformCard}>
                <div className={styles.platformCardHead}>
                  <div className={styles.platformCardIcon}>{c.emoji}</div>
                  <div className={styles.platformCardTitle}>{c.title}</div>
                </div>
                <div className={styles.platformCardBody}>{c.body}</div>
              </div>
            ))}
          </div>

          <div className={styles.statsStrip}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stripStat}>
                <div className={styles.stripVal}>{s.val}</div>
                <div className={styles.stripLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            Bot Tiers
          </div>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleSpaced}`}>
            Three Levels of <span>Strategy Complexity</span>
          </h2>
          <p className={styles.sectionBody}>
            Every tier generates a complete, compilable MQL file delivered as a downloadable binary. Clean code, no recurring licence fees.
          </p>
          <div className={styles.tiersGrid}>
            {TIERS.map((t) => (
              <div key={t.name} className={`${styles.tierCard} ${t.featured ? styles.tierCardFeatured : ""}`}>
                <div className={styles.tierHead}>
                  <div className={styles.tierName}>{t.name}</div>
                  <div className={styles.tierTag}>{t.tag}</div>
                </div>
                <div className={styles.tierFeatures}>
                  {t.features.map((f) => (
                    <div key={f} className={styles.tierFeature}>
                      <span className={styles.tierCheck}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            Audience
          </div>
          <h2 className={styles.sectionTitle}>
            Who Uses <span>ForexInstincts</span>
          </h2>
          <p className={styles.sectionBody}>
            Our audience consists entirely of active retail forex traders who operate on MetaTrader platforms — the same traders your affiliate programme is designed to acquire.
          </p>
          <div className={styles.audienceGrid}>
            {AUDIENCE.map((a) => (
              <div key={a.title} className={styles.audienceCard}>
                <div className={styles.audienceEmoji}>{a.emoji}</div>
                <div className={styles.audienceCardContent}>
                  <div className={styles.audienceCardTitle}>{a.title}</div>
                  <div className={styles.audienceCardBody}>{a.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.traitBox}>
            <div className={styles.traitBoxTitle}>Audience Characteristics</div>
            <div className={styles.traitList}>
              {TRAITS.map((t) => (
                <div key={t} className={styles.traitItem}>
                  <div className={styles.traitDot} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            Partnership
          </div>
          <h2 className={styles.sectionTitle}>
            Affiliate <span>Placement Opportunities</span>
          </h2>
          <p className={styles.sectionBody}>
            Partner placements on ForexInstincts are contextual — they appear at the exact moments traders are making decisions about brokers, infrastructure, and capital. No banner blindness; every placement aligns with a genuine user need.
          </p>
          <div className={styles.placementsGrid}>
            {PLACEMENTS.map((p) => (
              <div key={p.num} className={styles.placementCard}>
                <div className={styles.placementNum}>{p.num}</div>
                <div className={styles.placementContent}>
                  <div className={styles.placementTitle}>{p.title}</div>
                  <div className={styles.placementBody}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            Why Partner With Us
          </div>
          <div className={`${styles.whyList} ${styles.whyListSpaced}`}>
            {WHY.map((w, i) => (
              <div key={i} className={styles.whyItem}>
                <div className={styles.whyNum}>0{i + 1}</div>
                <div className={styles.whyText}>
                  <strong>{w.title}</strong> {w.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.section}>
          <div className={styles.sectionTag}>
            <div className={styles.sectionTagDot} />
            Contact
          </div>
          <div className={styles.contactBox}>
            <div className={styles.contactLeft}>
              <h2 className={styles.contactHeading}>
                Ready to <span>Partner?</span>
              </h2>
              <p className={styles.contactDesc}>
                Reach out to discuss placement options, commission structures, and how ForexInstincts can drive high-quality referrals to your platform. We respond within 24 hours.
              </p>
            </div>
            <div className={styles.contactRight}>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Email</div>
                <div className={styles.contactVal}>support@forexinstincts.com</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Website</div>
                <div className={styles.contactVal}>forexinstincts.com</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Niche</div>
                <div className={styles.contactVal}>Forex / Algo Trading / MT4 &amp; MT5</div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactLabel}>Audience</div>
                <div className={styles.contactVal}>Active MetaTrader Traders</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.coverFooter}>
          <div className={styles.coverFooterText}>
            © 2026 ForexInstincts &nbsp;—&nbsp; <span>forexinstincts.com</span>
          </div>
          <div className={styles.coverFooterText}>
            Media Kit &nbsp;·&nbsp; Confidential
          </div>
          <div className={styles.coverFooterText}>
            Contact: <span>support@forexinstincts.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
