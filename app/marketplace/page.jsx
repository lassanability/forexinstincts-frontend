"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/AuthStore";
import { useMarketplaceStore } from "@/app/store/MarketplaceStore";
import { useOrderStore } from "@/app/store/OrderStore";
import styles from "@/app/style/marketplace.module.css";
import { IoRocketOutline as RocketIcon } from "react-icons/io5";

const STRATEGY_LABELS = {
  ma_crossover: "MA Crossover",
  rsi_breakout: "RSI Breakout",
  macd_signal: "MACD Signal",
  bb_breakout: "BB Breakout",
  stoch_crossover: "Stoch Crossover",
  multi_indicator: "Multi Indicator",
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
        <div className={styles.loading}>
          <div className={styles.spinner} />
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
        <div className={styles.empty}>
          <h3>No Bots Available Yet</h3>
          <p>Check back soon — new bots are being added regularly.</p>
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
    </div>
  );
}
