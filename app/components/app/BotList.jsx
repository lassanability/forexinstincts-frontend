"use client";

import Link from "next/link";
import { TbRobot } from "react-icons/tb";
import BotStatus from "@/app/components/app/BotStatus";
import Pnl from "@/app/components/ui/Pnl";
import { useLive } from "@/app/stores/live";
import styles from "@/app/styles/appPage.module.css";

export default function BotList({ bots, currency = "USD" }) {
  const live = useLive((state) => state.bots);

  return (
    <div className={styles.list}>
      {bots.map((initial) => {
        const bot = live[initial.id] ?? initial;
        const edge = bot.stats.profit - bot.stats.twinProfit;
        return (
          <Link key={bot.id} href={`/bots/${bot.id}`} className={styles.item}>
            <span className={styles.itemIcon}>
              <TbRobot aria-hidden="true" />
            </span>
            <span className={styles.itemText}>
              <strong className="truncate">{bot.name}</strong>
              <small className="truncate">
                {bot.symbol.replace("frx", "")} · {bot.stats.trades} trades · {bot.status === "halted" ? bot.haltReason : bot.strategy}
              </small>
            </span>
            <span className={styles.right}>
              <Pnl value={bot.stats.dayProfit} currency={currency} />
              <small className="faint">today</small>
            </span>
            <span className={styles.right}>
              <Pnl value={bot.stats.profit} currency={currency} />
              <small className="faint">vs random {edge >= 0 ? "+" : "−"}{Math.abs(edge).toFixed(2)}</small>
            </span>
            <BotStatus status={bot.status} />
          </Link>
        );
      })}
    </div>
  );
}
