"use client";

import {
  IoDownloadOutline as DownloadIcon,
  IoCheckmarkCircle as CheckIcon,
  IoAlertCircle as AlertIcon,
  IoSyncOutline as SyncIcon,
  IoTimeOutline as ClockIcon,
  IoTrashOutline as TrashIcon,
  IoRocketOutline as RocketIcon,
  IoCopyOutline as CopyIcon,
  IoOpenOutline as OpenIcon,
  IoPulseOutline as LiveIcon,
  IoBarChartOutline as ChartIcon,
} from "react-icons/io5";
import styles from "@/app/style/botCard.module.css";
import AdCard from "@/app/components/ads/AdCard";
import { useAdvertStore } from "@/app/store/AdvertStore";

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

const STATUS_CONFIG = {
  pending:    { label: "Queued",     Icon: ClockIcon },
  generating: { label: "Generating", Icon: SyncIcon  },
  completed:  { label: "Ready",      Icon: CheckIcon },
  failed:     { label: "Failed",     Icon: AlertIcon },
  expired:    { label: "Expired",    Icon: AlertIcon },
};

const formatTrialExpiry = (dateStr) => {
  if (!dateStr) return "6h after generation";
  const d = new Date(dateStr);
  if (d < new Date()) return "Expired";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const strategyLabel = (strategy) =>
  strategy ? (STRATEGY_LABELS[strategy] || strategy.replace(/_/g, " ")) : null;

function copyToClipboard(text, label = "Copied!") {
  navigator.clipboard?.writeText(text).then(() => {
    const el = document.createElement("div");
    el.textContent = label;
    el.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#00c896;color:#fff;padding:8px 18px;border-radius:8px;font-size:14px;z-index:9999;pointer-events:none";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  });
}

export default function BotCard({
  variant = "dashboard",
  order,
  onDownload,
  onDelete,
  onToggleVisibility,
  downloadingId,
  deletingId,
  confirmDeleteId,
  onConfirmDelete,
  onCancelDelete,
  bot,
  onBuy,
  buyingId,
}) {
  const botSuccessAd = useAdvertStore((s) => s.ads.find((a) => a.isActive && a.affiliateLink && a.showBotSuccess));

  if (variant === "dashboard") {
    const isExpired = !order.isTrial && order.botLicenseExpiresAt && new Date(order.botLicenseExpiresAt) < new Date();
    const genStatus = isExpired ? "expired" : (order.generation?.status || "pending");
    const { Icon: StatusIcon, label: statusLabel } = STATUS_CONFIG[genStatus] || STATUS_CONFIG.pending;
    const isReady   = genStatus === "completed";
    const isFailed  = genStatus === "failed";
    const platform  = order.config?.platform;
    const isMT      = !platform || platform === "MT4" || platform === "MT5" || platform === "both";
    const isTV      = platform === "TradingView";

    return (
      <div className={styles.card} data-trial={order.isTrial ? "true" : undefined}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <h3 className={styles.cardName}>{order.botName}</h3>
            <div className={styles.cardMeta}>
              {order.isTrial && <span className={styles.trialPill}>Trial</span>}
              {order.tierName && <span className={styles.tag}>{order.tierName}</span>}
              {order.config?.symbol && <span className={styles.tag}>{order.config.symbol}</span>}
              {order.config?.timeframe && <span className={styles.tag}>{order.config.timeframe}</span>}
            </div>
          </div>
          <div className={styles.statusBadge} data-status={genStatus}>
            <StatusIcon />
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detail}>
            <span>Platform</span>
            <span>{platform || "MT4"}</span>
          </div>
          <div className={styles.detail}>
            <span>Strategy</span>
            <span>{strategyLabel(order.config?.entry?.strategy) || "MA Crossover"}</span>
          </div>
          {isMT && (
            <div className={styles.detail}>
              <span>Downloads</span>
              <span>{order.generation?.downloadCount || 0}</span>
            </div>
          )}
          {order.isTrial && (
            <div
              className={styles.detail}
              data-expired={order.trialExpiresAt && new Date(order.trialExpiresAt) < new Date() ? "true" : undefined}
            >
              <span>Trial Expires</span>
              <span>{formatTrialExpiry(order.trialExpiresAt)}</span>
            </div>
          )}
        </div>

        {isReady && (
          <div className={styles.actions}>
            <div className={styles.primaryActions}>
              <a href="/terminal?tab=backtest" className={styles.actionBacktest}>
                <ChartIcon /><span>Backtest</span>
              </a>
              <a href="/terminal?tab=capital" className={styles.actionOanda}>
                <LiveIcon /><span>Trade via Capital.com</span>
              </a>
            </div>

            {isTV && order.generation?.pineCode && (
              <div className={styles.secondaryActions}>
                <button className={styles.actionSecondary} onClick={() => copyToClipboard(order.generation.pineCode, "Pine Script copied!")}>
                  <CopyIcon /><span>Copy Pine Script</span>
                </button>
                <a href="https://www.tradingview.com/pine-script-editor" target="_blank" rel="noopener noreferrer" className={styles.actionSecondary}>
                  <OpenIcon /><span>Open TradingView</span>
                </a>
              </div>
            )}

            {isMT && (
              <div className={styles.secondaryActions}>
                {order.generation?.mt4Code && (
                  <button
                    className={styles.actionSecondary}
                    onClick={() => onDownload(order._id, order.botName, "mt4")}
                    disabled={downloadingId === `${order._id}-mt4`}
                  >
                    <DownloadIcon />
                    <span>{downloadingId === `${order._id}-mt4` ? "Preparing..." : "Download MT4"}</span>
                  </button>
                )}
                {order.generation?.mt5Code && (
                  <button
                    className={styles.actionSecondary}
                    onClick={() => onDownload(order._id, order.botName, "mt5")}
                    disabled={downloadingId === `${order._id}-mt5`}
                  >
                    <DownloadIcon />
                    <span>{downloadingId === `${order._id}-mt5` ? "Preparing..." : "Download MT5"}</span>
                  </button>
                )}
              </div>
            )}

            <div className={styles.capitalEncourage}>
              <LiveIcon className={styles.encourageIcon} />
              <span>Connect your Capital.com account in the terminal and let this bot trade automatically, no files to manage.</span>
            </div>
          </div>
        )}

        {isReady && botSuccessAd && <AdCard ad={botSuccessAd} variant="botSuccess" />}

        {!isReady && !isFailed && !isExpired && (
          <div className={styles.infoMsg}>
            You will receive an email when your bot is ready. If you don&apos;t see it, check your spam or junk folder.
          </div>
        )}

        {isFailed && (
          <div className={styles.errorMsg}>Generation failed. Please contact support.</div>
        )}

        {isExpired && (
          <div className={styles.errorMsg}>License expired. Contact support to renew your bot.</div>
        )}

        <div className={styles.cardFooter}>
          <div className={styles.visibilityRow}>
            <span className={styles.visibilityLabel}>{order.isPublic ? "Public" : "Private"}</span>
            <label className={styles.toggleTrack}>
              <input
                type="checkbox"
                checked={!order.isPublic}
                onChange={() => onToggleVisibility(order._id, !order.isPublic)}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          {confirmDeleteId === order._id ? (
            <div className={styles.deleteConfirm}>
              <span>Delete this bot?</span>
              <button className={styles.confirmYes} onClick={() => onConfirmDelete(order._id)} disabled={deletingId === order._id}>Yes</button>
              <button className={styles.confirmNo} onClick={onCancelDelete}>Cancel</button>
            </div>
          ) : (
            <button className={styles.deleteBtn} onClick={() => onDelete(order._id)} disabled={deletingId === order._id}>
              <TrashIcon />
              <span>{deletingId === order._id ? "Deleting..." : "Delete"}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const platform = bot.platform || bot.config?.platform;
  const label    = strategyLabel(bot.config?.entry?.strategy);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{bot.name}</h3>
          {bot.isUserBot && <span className={styles.communityTag}>Community Bot</span>}
          {bot.description && <p className={styles.cardDesc}>{bot.description}</p>}
        </div>
        {bot.price > 0 && <div className={styles.cardPrice}>${bot.price}</div>}
      </div>

      <div className={styles.cardMeta}>
        {platform && <span className={styles.tag}>{platform}</span>}
        {bot.config?.symbol && <span className={styles.tag}>{bot.config.symbol}</span>}
        {bot.config?.timeframe && <span className={styles.tag}>{bot.config.timeframe}</span>}
        {bot.tierName && <span className={styles.tag}>{bot.tierName}</span>}
        {label && <span className={styles.tag}>{label}</span>}
      </div>

      <button className={styles.buyBtn} onClick={() => onBuy(bot)} disabled={buyingId === bot._id}>
        <RocketIcon />
        {buyingId === bot._id ? "Processing..." : `Buy for $${bot.price}`}
      </button>
    </div>
  );
}
