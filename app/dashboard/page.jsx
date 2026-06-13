"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import { toast } from "sonner";
import styles from "@/app/style/dashboard.module.css";
import {
  IoRocketOutline as RocketIcon,
  IoDownloadOutline as DownloadIcon,
  IoCodeSlash as CodeIcon,
  IoTimeOutline as ClockIcon,
  IoCheckmarkCircle as CheckIcon,
  IoAlertCircle as AlertIcon,
  IoSyncOutline as SyncIcon,
  IoStar as StarFilledIcon,
  IoStarOutline as StarEmptyIcon,
  IoChatbubbleEllipsesOutline as TestimonyIcon,
  IoHelpCircleOutline as GuideIcon,
} from "react-icons/io5";

const HOW_TO_STEPS = [
  {
    title: "Download Your Bot File",
    desc: "Click the MT4 or MT5 download button on your bot card above. You will receive a .mq4 or .mq5 source file.",
  },
  {
    title: "Open MetaTrader Data Folder",
    desc: "In MetaTrader, go to File → Open Data Folder. Navigate to MQL4/Experts (MT4) or MQL5/Experts (MT5).",
  },
  {
    title: "Copy the EA File",
    desc: "Paste the downloaded .mq4 or .mq5 file into the Experts folder you just opened.",
  },
  {
    title: "Refresh the Navigator",
    desc: "In MetaTrader, right-click on Navigator → Expert Advisors → Refresh. Your bot will appear in the list.",
  },
  {
    title: "Attach to a Chart",
    desc: "Drag your bot from Navigator → Expert Advisors onto the chart matching the symbol and timeframe you configured.",
  },
  {
    title: "Enable AutoTrading",
    desc: 'Check "Allow automated trading" in the EA settings popup, then click the AutoTrading button in the toolbar (or press Ctrl+E).',
  },
];

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

const formatTrialExpiry = (dateStr) => {
  if (!dateStr) return "6h after generation";
  const d = new Date(dateStr);
  const now = new Date();
  if (d < now) return "Expired";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const STATUS_CONFIG = {
  pending:    { label: "Queued",     Icon: ClockIcon },
  generating: { label: "Generating", Icon: SyncIcon },
  completed:  { label: "Ready",      Icon: CheckIcon },
  failed:     { label: "Failed",     Icon: AlertIcon },
};

export default function Dashboard() {
  const router = useRouter();
  const { isAuth, username, isInitialized, initializeAuth } = useAuthStore();
  const { orders: rawOrders, ordersLoading, getMyOrders, downloadBot } = useOrderStore();
  const orders = rawOrders.filter(
    (o) => o.status === "paid" || o.status === "generated" || o.status === "trial" || o.isTrial
  );
  const [downloadingId, setDownloadingId] = useState(null);

  const [testimonyText, setTestimonyText] = useState("");
  const [testimonyRating, setTestimonyRating] = useState(5);
  const [testimonySubmitting, setTestimonySubmitting] = useState(false);
  const [testimonyDone, setTestimonyDone] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuth) {
      router.push("/authentication/login");
      return;
    }
    getMyOrders();
  }, [isAuth, isInitialized, router, getMyOrders]);

  const handleDownload = async (orderId, botName, type) => {
    setDownloadingId(`${orderId}-${type}`);
    try {
      const result = await downloadBot(orderId, type);
      if (result.success) {
        const ext = type === "mt5" ? "mq5" : "mq4";
        const a = document.createElement("a");
        a.href = result.url;
        a.download = `${botName || "bot"}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(result.url);
        toast.success(`${type.toUpperCase()} file downloaded`);
      } else {
        toast.error(result.message || "Download failed");
      }
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleTestimonySubmit = async () => {
    if (!testimonyText.trim()) {
      toast.error("Please write your experience before submitting");
      return;
    }
    setTestimonySubmitting(true);
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await fetch(`${SERVER_API}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ name: username || "Anonymous", content: testimonyText, rating: testimonyRating }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Thank you! Your testimonial has been submitted for review.");
        setTestimonyDone(true);
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setTestimonySubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <CodeIcon className={styles.loaderIcon} />
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <CodeIcon className={styles.loaderIcon} />
          <p>Loading your bots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <main className={styles.dashboardMain}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerTop}>
            <div>
              <h1>My Trading Bots</h1>
              <p>
                Welcome back, {username || "Trader"}. Manage and download your generated bots.
              </p>
            </div>
            <Link href="/tiers" className={styles.buildNewBtn}>
              <RocketIcon />
              <span>Build New Bot</span>
            </Link>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <CodeIcon className={styles.emptyIcon} />
            <h3>No Bots Yet</h3>
            <p>Build your first automated trading bot to get started</p>
            <Link href="/tiers" className={styles.emptyBuildBtn}>
              <RocketIcon />
              <span>Build Your First Bot</span>
            </Link>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => {
              const genStatus = order.generation?.status || "pending";
              const status = STATUS_CONFIG[genStatus] || STATUS_CONFIG.pending;
              const isReady = genStatus === "completed";
              const isFailed = genStatus === "failed";

              return (
                <div key={order._id} className={styles.orderCard} data-trial={order.isTrial ? "true" : undefined}>
                  <div className={styles.orderCardHeader}>
                    <div className={styles.orderInfo}>
                      <h3>{order.botName}</h3>
                      <div className={styles.orderMeta}>
                        {order.isTrial && (
                          <div className={styles.orderTrialPill}>
                            <span>Trial</span>
                          </div>
                        )}
                        <span>{order.tierName}</span>
                        <span>•</span>
                        <span>{order.config?.symbol || "—"}</span>
                        <span>•</span>
                        <span>{order.config?.timeframe || "—"}</span>
                      </div>
                    </div>
                    <div
                      className={styles.orderStatus}
                      data-status={genStatus}
                    >
                      <status.Icon />
                      <span>{status.label}</span>
                    </div>
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.orderDetail}>
                      <span>Platform</span>
                      <span>{order.config?.platform || "MT4"}</span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span>Strategy</span>
                      <span>
                        {(order.config?.entry?.strategy || "ma_crossover").replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className={styles.orderDetail}>
                      <span>Downloads</span>
                      <span>{order.generation?.downloadCount || 0}</span>
                    </div>
                    {order.isTrial && (
                      <div
                        className={styles.orderDetail}
                        data-expired={
                          order.trialExpiresAt && new Date(order.trialExpiresAt) < new Date()
                            ? "true"
                            : undefined
                        }
                      >
                        <span>Trial Expires</span>
                        <span>{formatTrialExpiry(order.trialExpiresAt)}</span>
                      </div>
                    )}
                  </div>

                  {isReady && (
                    <div className={styles.orderActions}>
                      {order.generation?.mt4Code && (
                        <button
                          className={styles.dlBtn}
                          onClick={() => handleDownload(order._id, order.botName, "mt4")}
                          disabled={downloadingId === `${order._id}-mt4`}
                        >
                          <DownloadIcon />
                          <span>
                            {downloadingId === `${order._id}-mt4` ? "Preparing..." : "Download MT4"}
                          </span>
                        </button>
                      )}
                      {order.generation?.mt5Code && (
                        <button
                          className={styles.dlBtn}
                          onClick={() => handleDownload(order._id, order.botName, "mt5")}
                          disabled={downloadingId === `${order._id}-mt5`}
                        >
                          <DownloadIcon />
                          <span>
                            {downloadingId === `${order._id}-mt5` ? "Preparing..." : "Download MT5"}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {!isReady && !isFailed && (
                    <div className={styles.orderFailed} data-info="true">
                      You will receive an email when your bot is ready. If you don&apos;t see it, check your spam or junk folder.
                    </div>
                  )}

                  {isFailed && (
                    <div className={styles.orderFailed}>
                      Generation failed. Please contact support.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.howToSection}>
          <div className={styles.howToHeader}>
            <div className={styles.howToIconWrap}>
              <GuideIcon />
            </div>
            <div>
              <h2>How to Install Your Bot</h2>
              <p>Follow these steps to get your Expert Advisor running in MetaTrader</p>
            </div>
          </div>
          <div className={styles.howToSteps}>
            {HOW_TO_STEPS.map((step, i) => (
              <div key={i} className={styles.howToStep}>
                <div className={styles.howToStepNum}>{i + 1}</div>
                <div className={styles.howToStepContent}>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.howToNote}>
            After attaching the EA, MetaTrader will compile it automatically. A green smiley face icon in the top-right corner of the chart confirms the bot is running.
          </p>
        </div>

        <div className={styles.testimonySection}>
          <div className={styles.testimonySectionHeader}>
            <div className={styles.testimonyIcon}>
              <TestimonyIcon />
            </div>
            <div>
              <h2>Share Your Experience</h2>
              <p>Help other traders by sharing your ForexInstincts story</p>
            </div>
          </div>

          {testimonyDone ? (
            <div className={styles.testimonySuccess}>
              <CheckIcon />
              <p>Thank you! Your testimonial has been submitted and will appear once approved.</p>
            </div>
          ) : (
            <div className={styles.testimonyForm}>
              <div className={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={styles.star}
                    onClick={() => setTestimonyRating(star)}
                  >
                    {star <= testimonyRating ? <StarFilledIcon /> : <StarEmptyIcon />}
                  </div>
                ))}
              </div>
              <textarea
                className={styles.testimonyTextarea}
                placeholder="Tell us about your experience building bots with ForexInstincts..."
                value={testimonyText}
                onChange={(e) => setTestimonyText(e.target.value)}
                rows={4}
              />
              <button
                className={styles.testimonySubmitBtn}
                onClick={handleTestimonySubmit}
                disabled={testimonySubmitting}
              >
                {testimonySubmitting ? "Submitting..." : "Submit Testimonial"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
