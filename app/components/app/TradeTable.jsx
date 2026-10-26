"use client";

import Badge from "@/app/components/ui/Badge";
import Pnl from "@/app/components/ui/Pnl";
import { money, timeAgo } from "@/app/lib/format";
import { useLive } from "@/app/stores/live";
import styles from "@/app/styles/appPage.module.css";

const STATUS = { open: "ember", won: "up", lost: "down", sold: "plain" };

export default function TradeTable({ trades, botId }) {
  const updates = useLive((state) => state.trades);
  const quotes = useLive((state) => state.quotes);
  const merged = [...Object.values(updates).filter((trade) => (!botId || trade.botId === botId) && !trades.some((entry) => entry.id === trade.id)), ...trades.map((trade) => updates[trade.id] ?? trade)].sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Market</th>
            <th>Type</th>
            <th>Stake</th>
            <th>Result</th>
            <th>Status</th>
            <th>Opened</th>
          </tr>
        </thead>
        <tbody>
          {merged.map((trade) => (
            <tr key={trade.id}>
              <td className="mono faint">#{trade.contractId}</td>
              <td>{trade.symbol.replace("frx", "")}</td>
              <td className="mono">{trade.contractType}</td>
              <td className="mono">{money(trade.stake)}</td>
              <td>
                <Pnl value={trade.status === "open" ? (quotes[trade.id]?.profit ?? 0) : trade.profit} />
              </td>
              <td>
                <Badge tone={STATUS[trade.status]}>{trade.status}</Badge>
              </td>
              <td className="faint">{timeAgo(trade.openedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
