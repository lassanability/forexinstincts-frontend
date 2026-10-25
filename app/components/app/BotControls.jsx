"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TbPlayerPlay, TbPlayerStop, TbSquareX, TbTrash } from "react-icons/tb";
import { deleteBot, startBot, stopBot } from "@/app/actions/trading";
import BotStatus from "@/app/components/app/BotStatus";
import Button from "@/app/components/ui/Button";
import Pnl from "@/app/components/ui/Pnl";
import Stat from "@/app/components/ui/Stat";
import { percent } from "@/app/lib/format";
import { useLive } from "@/app/stores/live";
import { toast } from "@/app/stores/toast";
import styles from "@/app/styles/appPage.module.css";

export default function BotControls({ bot: initial }) {
  const router = useRouter();
  const bot = useLive((state) => state.bots[initial.id]) ?? initial;
  const allNotes = useLive((state) => state.notes);
  const notes = allNotes.filter((note) => note.botId === initial.id);
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const running = bot.status === "running";
  const ladder = bot.risk.recovery === "martingale";

  const act = (work, after) =>
    start(async () => {
      const result = await work();
      if (result.error) return toast.error(result.error);
      toast.success(result.message);
      after?.();
      router.refresh();
    });

  const stats = bot.stats;
  const edge = stats.profit - stats.twinProfit;

  return (
    <div className="stack gap-lg">
      <div className={styles.header}>
        <div className="row gap-md">
          <BotStatus status={bot.status} />
          {bot.haltReason && <span className="muted">{bot.haltReason}</span>}
        </div>
        <div className={styles.actions}>
          {running ? (
            <>
              <Button variant="glass" icon={TbPlayerStop} loading={pending} onClick={() => act(() => stopBot(bot.id))}>
                Stop
              </Button>
              <Button variant="danger" icon={TbSquareX} loading={pending} onClick={() => act(() => stopBot(bot.id, true))}>
                Stop and close trades
              </Button>
            </>
          ) : ladder && !confirming ? (
            <Button icon={TbPlayerPlay} onClick={() => setConfirming(true)}>
              Start bot
            </Button>
          ) : (
            <>
              {confirming && <span className="down">This bot uses martingale. I understand a losing streak can cost many times my stake.</span>}
              <Button icon={TbPlayerPlay} loading={pending} onClick={() => act(() => startBot(bot.id, ladder), () => setConfirming(false))}>
                {confirming ? "I understand, start" : "Start bot"}
              </Button>
              <Button variant="ghost" icon={TbTrash} loading={pending} onClick={() => act(() => deleteBot(bot.id), () => router.push("/bots"))}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.stats}>
        <Stat label="Since start" value={<Pnl value={stats.profit} />} note={`${stats.trades} trades`} />
        <Stat label="Today" value={<Pnl value={stats.dayProfit} />} note={`Limit −${bot.risk.maxDailyLoss}`} />
        <Stat label="Win rate" value={stats.trades ? percent(stats.wins / stats.trades, 0) : "—"} note={`${stats.lossStreak} losses in a row now`} />
        <Stat label="vs random twin" value={<Pnl value={edge} />} note="Live result minus coin-flip trades" />
        <Stat label="Worst drawdown" value={<Pnl value={-stats.maxDrawdown} />} note={`Stops at ${bot.risk.maxDrawdownPercent}%`} />
      </div>

      {notes.length > 0 && (
        <ul className={`glass ${styles.list}`}>
          {notes.slice(0, 5).map((note) => (
            <li key={`${note.at}-${note.message}`} className={styles.item}>
              <span className="mono faint">{new Date(note.at).toLocaleTimeString()}</span>
              <span>{note.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
