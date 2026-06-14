"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/AuthStore";
import { useMarketplaceStore } from "@/app/store/MarketplaceStore";
import { useOrderStore } from "@/app/store/OrderStore";
import BotInstallGuide from "@/app/components/BotInstallGuide";
import styles from "@/app/style/marketplace.module.css";
import { IoRocketOutline as RocketIcon, IoCodeSlash as BotIcon } from "react-icons/io5";

const STRATEGY_LABELS = {
  ma_crossover:          "MA Crossover",
  rsi_breakout:          "RSI Breakout",
  macd_signal:           "MACD Signal",
  bb_breakout:           "BB Breakout",
  stoch_crossover:       "Stoch Crossover",
  multi_indicator:       "Multi Indicator",
  price_action_breakout: "Price Action",
  candlestick_pattern:   "Candlestick",
};

export default function MarketplacePage() {
  const router = useRouter();
  const { isAuth } = useAuthStore();
  const { bots, loading, fetchBots } = useMarketplaceStore();
  const { buyPrebuiltBot, initializePayment } = useOrderStore();
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleBuy = async (bot) => {
    if (!isAuth) {
      toast.error("Please sign in to purchase a bot");
      router.push("/authentication/login");
      return;
    }

    setBuyingId(bot._id);
    try {
      const orderResult = await buyPrebuiltBot(bot._id);
      if (!orderResult.success) {
        toast.error(orderResult.message || "Failed to create order");
        return;
      }

      const payResult = await initializePayment(orderResult.orderId);
      if (!payResult.success) {
        toast.error(payResult.message || "Payment initialization failed");
        return;
      }

      if (payResult.freeMode) {
        toast.success("Bot is being generated for free!");
        router.push("/dashboard");
        return;
      }

      window.location.href = payResult.invoiceUrl;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBuyingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Bot Marketplace</h1>
          <p>Ready-to-use trading bots built by our experts. Buy once, use immediately.</p>
        </div>
        <div className={styles.grid}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonTitle} skeleton`} />
              <div className={`${styles.skeletonText} skeleton`} />
              <div className={`${styles.skeletonTextShort} skeleton`} />
              <div className={styles.skeletonTags}>
                {Array(4).fill(0).map((_, j) => (
                  <div key={j} className={`${styles.skeletonTag} skeleton`} />
                ))}
              </div>
              <div className={`${styles.skeletonBtn} skeleton`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Bot Marketplace</h1>
        <p>Ready-to-use trading bots built by our experts. Buy once, use immediately.</p>
      </div>

      {bots.length === 0 ? (
        <div className={styles.emptyState}>
          <BotIcon className={styles.emptyIcon} />
          <p className={styles.emptyText}>No bots available yet. Check back soon.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {bots.map((bot) => (
            <div key={bot._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardName}>{bot.name}</h2>
                  {bot.description && <p className={styles.cardDesc}>{bot.description}</p>}
                </div>
                <div className={styles.cardPrice}>${bot.price}</div>
              </div>

              <div className={styles.cardMeta}>
                <span className={styles.tag}>{bot.platform}</span>
                <span className={styles.tag}>{bot.config?.symbol || "EURUSD"}</span>
                <span className={styles.tag}>{bot.config?.timeframe || "H1"}</span>
                <span className={styles.tag}>{bot.tierName}</span>
                {bot.config?.entry?.strategy && (
                  <span className={styles.tag}>
                    {STRATEGY_LABELS[bot.config.entry.strategy] || bot.config.entry.strategy}
                  </span>
                )}
              </div>

              <button
                className={styles.buyBtn}
                onClick={() => handleBuy(bot)}
                disabled={buyingId === bot._id}
              >
                <RocketIcon />
                {buyingId === bot._id ? "Processing..." : `Buy for $${bot.price}`}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.guideSection}>
        <BotInstallGuide />
      </div>

      <div className={styles.disclaimer}>
        <p>
          Marketplace bots are pre-built Expert Advisors designed to give new traders a structured starting point in automated trading. They are not guaranteed to generate profits, positive returns, or trading success of any kind. Market conditions are unpredictable, and individual results will vary based on broker, account type, market volatility, and other factors outside our control. All trading involves risk — only trade with capital you can afford to lose.
        </p>
        <div className={styles.disclaimerLinks}>
          <Link href="/terms">Terms of Use</Link>
          <span>·</span>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
