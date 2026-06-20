"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { createChart } from "lightweight-charts";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/AuthStore";
import { useAdvertStore } from "@/app/store/AdvertStore";
import { useOrderStore } from "@/app/store/OrderStore";
import AdCard from "@/app/components/ads/AdCard";
import BotCard from "@/app/components/BotCard";
import BotInstallGuide from "@/app/components/BotInstallGuide";
import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/terminal.module.css";
import dashStyles from "@/app/style/dashboard.module.css";
import authStyles from "@/app/style/auth.module.css";
import {
  IoGridOutline           as BotsTabIcon,
  IoBarChartOutline       as ChartIcon,
  IoCodeSlash             as CodeIcon,
  IoRocketOutline         as RocketIcon,
  IoPlayCircleOutline     as RunIcon,
  IoSwapVerticalOutline   as TradeIcon,
  IoCashOutline           as PnlIcon,
  IoBarChartOutline       as StatsIcon,
  IoLinkOutline           as LinkIcon,
  IoAlertCircleOutline    as WarnIcon,
  IoCheckmarkCircleOutline as CheckIcon,
  IoCloseCircleOutline    as CloseIcon,
  IoArrowUpOutline        as BuyIcon,
  IoArrowDownOutline      as SellIcon,
  IoRefreshOutline        as RefreshIcon,
  IoPulseOutline          as LiveIcon,
  IoKeyOutline            as KeyIcon,
  IoCopyOutline           as CopyIcon,
  IoOpenOutline           as OpenIcon,
  IoTrendingUpOutline     as EarningsIcon,
  IoPeopleOutline         as PeopleIcon,
  IoStarOutline           as StarEmptyIcon,
  IoStar                  as StarFilledIcon,
  IoChatbubbleEllipsesOutline as TestimonyIcon,
  IoCheckmarkCircle       as CheckIconSolid,
  IoWalletOutline         as WalletIcon,
} from "react-icons/io5";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

const SYMBOLS = [
  { label: "EUR/USD", from: "EUR", to: "USD", capital: "EURUSD", oanda: "EUR_USD", tv: "FX:EURUSD"       },
  { label: "GBP/USD", from: "GBP", to: "USD", capital: "GBPUSD", oanda: "GBP_USD", tv: "FX:GBPUSD"      },
  { label: "USD/JPY", from: "USD", to: "JPY", capital: "USDJPY", oanda: "USD_JPY", tv: "FX:USDJPY"      },
  { label: "USD/CHF", from: "USD", to: "CHF", capital: "USDCHF", oanda: "USD_CHF", tv: "FX:USDCHF"      },
  { label: "AUD/USD", from: "AUD", to: "USD", capital: "AUDUSD", oanda: "AUD_USD", tv: "FX:AUDUSD"      },
  { label: "USD/CAD", from: "USD", to: "CAD", capital: "USDCAD", oanda: "USD_CAD", tv: "FX:USDCAD"      },
  { label: "XAU/USD", from: "XAU", to: "USD", capital: "GOLD",   oanda: "XAU_USD", tv: "CAPITALCOM:GOLD" },
];

const STRATEGIES = [
  { value: "ma_crossover",    label: "MA Crossover"    },
  { value: "rsi_breakout",    label: "RSI Breakout"    },
  { value: "macd_signal",     label: "MACD Signal"     },
  { value: "bb_breakout",     label: "BB Breakout"     },
  { value: "stoch_crossover", label: "Stoch Crossover" },
];

const PERIODS = [
  { label: "1 Week",   avSize: "compact", days: 100, tradeWindow: 7,   capitalCount: 100, capitalTf: "DAY", oandaCount: 100, oandaTf: "D" },
  { label: "2 Weeks",  avSize: "compact", days: 100, tradeWindow: 14,  capitalCount: 100, capitalTf: "DAY", oandaCount: 100, oandaTf: "D" },
  { label: "1 Month",  avSize: "compact", days: 100, tradeWindow: 22,  capitalCount: 100, capitalTf: "DAY", oandaCount: 100, oandaTf: "D" },
  { label: "3 Months", avSize: "compact", days: 100, tradeWindow: 90,  capitalCount: 100, capitalTf: "DAY", oandaCount: 100, oandaTf: "D" },
  { label: "6 Months", avSize: "full",    days: 180, tradeWindow: 180, capitalCount: 180, capitalTf: "DAY", oandaCount: 180, oandaTf: "D" },
  { label: "1 Year",   avSize: "full",    days: 365, tradeWindow: 365, capitalCount: 365, capitalTf: "DAY", oandaCount: 365, oandaTf: "D" },
];

const PERIOD_OPTS   = PERIODS.map((p)    => ({ value: p.label, name: p.label }));
const STRATEGY_OPTS = STRATEGIES.map((s) => ({ value: s.value, name: s.label }));
const SYMBOL_OPTS   = SYMBOLS.map((s)    => ({ value: s.label, name: s.label }));
const ENV_OPTS      = [
  { value: "practice", name: "Practice (Demo)" },
  { value: "live",     name: "Live"             },
];

const CHART_OPTS = {
  layout: { background: { color: "transparent" }, textColor: "#94a3b8" },
  grid: {
    vertLines: { color: "rgba(0,200,150,0.06)" },
    horzLines: { color: "rgba(0,200,150,0.06)" },
  },
  rightPriceScale: { borderColor: "rgba(0,200,150,0.15)" },
  timeScale: { borderColor: "rgba(0,200,150,0.15)", timeVisible: true },
};

function TradingViewChart({ symbol = "FX:EURUSD" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.textContent = JSON.stringify({
      autosize: true, symbol, interval: "60", timezone: "Etc/UTC",
      theme: "dark", style: "1", locale: "en",
      backgroundColor: "rgba(11, 15, 26, 1)",
      allow_symbol_change: true, save_image: false, hide_top_toolbar: false,
    });
    el.appendChild(script);
    return () => { el.innerHTML = ""; };
  }, [symbol]);
  return <div ref={ref} className={styles.tvChartWrap} />;
}

async function fetchAVCandles(from, to, outputsize) {
  const res  = await fetch(`${SERVER_API}/market/av-candles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, outputsize }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch candle data");
  return json.data;
}

function calcSMA(closes, period) {
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    return closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
  });
}

function calcRSI(closes, period = 14) {
  const out = new Array(period).fill(null);
  let g = 0, l = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d > 0) g += d; else l += Math.abs(d);
  }
  g /= period; l /= period;
  for (let i = period; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    g = (g * (period - 1) + Math.max(d, 0)) / period;
    l = (l * (period - 1) + Math.max(-d, 0)) / period;
    out.push(l === 0 ? 100 : 100 - 100 / (1 + g / l));
  }
  return out;
}

function runBacktest(candles, strategy, sl, tp, tradeWindow) {
  const closes     = candles.map((c) => c.close);
  const pip        = closes[0] > 50 ? 0.01 : 0.0001;
  const slD        = sl * pip;
  const tpD        = tp * pip;
  const fast       = calcSMA(closes, 10);
  const slow       = calcSMA(closes, 50);
  const rsi        = calcRSI(closes, 14);
  const tradeStart = candles.length - (tradeWindow ?? candles.length);
  const startIdx   = Math.max(51, tradeStart);
  let trade = null;
  const trades = [];
  let equity = 10000, peak = 10000, maxDD = 0;
  const equityCurve = [{ time: candles[startIdx].time, value: equity }];
  for (let i = startIdx; i < candles.length; i++) {
    const c = candles[i];
    if (!trade) {
      let buy = false, sell = false;
      if (strategy === "rsi_breakout") {
        buy  = rsi[i] !== null && rsi[i] < 30 && rsi[i - 1] >= 30;
        sell = rsi[i] !== null && rsi[i] > 70 && rsi[i - 1] <= 70;
      } else {
        buy  = fast[i] !== null && slow[i] !== null && fast[i] > slow[i] && fast[i - 1] <= slow[i - 1];
        sell = fast[i] !== null && slow[i] !== null && fast[i] < slow[i] && fast[i - 1] >= slow[i - 1];
      }
      if (buy)  trade = { type: "buy",  entry: c.close, time: c.time };
      if (sell) trade = { type: "sell", entry: c.close, time: c.time };
    } else {
      let exitPrice = null, reason = "";
      if (trade.type === "buy") {
        if (c.low  <= trade.entry - slD)                                                                      { exitPrice = trade.entry - slD; reason = "SL"; }
        else if (c.high >= trade.entry + tpD)                                                                 { exitPrice = trade.entry + tpD; reason = "TP"; }
        else if (fast[i] !== null && slow[i] !== null && fast[i] < slow[i] && fast[i - 1] >= slow[i - 1])   { exitPrice = c.close; reason = "Signal"; }
      } else {
        if (c.high >= trade.entry + slD)                                                                      { exitPrice = trade.entry + slD; reason = "SL"; }
        else if (c.low  <= trade.entry - tpD)                                                                 { exitPrice = trade.entry - tpD; reason = "TP"; }
        else if (fast[i] !== null && slow[i] !== null && fast[i] > slow[i] && fast[i - 1] <= slow[i - 1])   { exitPrice = c.close; reason = "Signal"; }
      }
      if (exitPrice !== null) {
        const pips = trade.type === "buy" ? (exitPrice - trade.entry) / pip : (trade.entry - exitPrice) / pip;
        const pnl  = pips * 1;
        equity += pnl;
        if (equity > peak) peak = equity;
        const dd = ((peak - equity) / peak) * 100;
        if (dd > maxDD) maxDD = dd;
        trades.push({ type: trade.type, entry: trade.entry, exit: exitPrice, pips, pnl, reason, entryTime: trade.time, exitTime: c.time });
        equityCurve.push({ time: c.time, value: parseFloat(equity.toFixed(2)) });
        trade = null;
      }
    }
  }
  const displayCandles = candles.slice(tradeStart);
  const wins   = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl <= 0);
  const grossW = wins.reduce((s, t) => s + t.pnl, 0);
  const grossL = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  return {
    candles: displayCandles, equityCurve, trades,
    stats: {
      total:   trades.length,
      wins:    wins.length,
      losses:  losses.length,
      winRate: trades.length ? ((wins.length / trades.length) * 100).toFixed(1) : "0.0",
      netPnl:  (equity - 10000).toFixed(2),
      pf:      grossL > 0 ? (grossW / grossL).toFixed(2) : grossW > 0 ? "∞" : "0.00",
      maxDD:   maxDD.toFixed(1),
    },
  };
}

function BacktestCharts({ result, idSuffix = "" }) {
  const chartRefs = useRef({});
  const pid = `fi_price${idSuffix}`;
  const eid = `fi_equity${idSuffix}`;

  useEffect(() => {
    if (!result) return;
    const pEl = document.getElementById(pid);
    const eEl = document.getElementById(eid);
    if (!pEl || !eEl) return;

    try { chartRefs.current.pc?.remove(); } catch {}
    try { chartRefs.current.ec?.remove(); } catch {}
    chartRefs.current = {};
    pEl.innerHTML = "";
    eEl.innerHTML = "";

    const pHeight = Math.max(pEl.clientHeight || 220, 180);
    const pc = createChart(pEl, { ...CHART_OPTS, width: pEl.clientWidth, height: pHeight, crosshair: { mode: 1 } });
    const cs = pc.addCandlestickSeries({ upColor: "#00c896", downColor: "#ff3b4e", borderUpColor: "#00c896", borderDownColor: "#ff3b4e", wickUpColor: "#00c896", wickDownColor: "#ff3b4e" });
    cs.setData(result.candles);
    const markers = result.trades.flatMap((t) => [
      { time: t.entryTime, position: t.type === "buy" ? "belowBar" : "aboveBar", color: "#00c896", shape: t.type === "buy" ? "arrowUp" : "arrowDown", text: t.type.toUpperCase() },
      { time: t.exitTime,  position: t.type === "buy" ? "aboveBar" : "belowBar", color: t.pnl > 0 ? "#00e5b0" : "#ff3b4e", shape: "circle", text: t.reason },
    ]).sort((a, b) => a.time - b.time);
    cs.setMarkers(markers);
    pc.timeScale().fitContent();

    const ec = createChart(eEl, { ...CHART_OPTS, width: eEl.clientWidth, height: Math.max(eEl.clientHeight || 90, 70) });
    const ls = ec.addAreaSeries({ lineColor: "#00c896", topColor: "rgba(0,200,150,0.2)", bottomColor: "rgba(0,200,150,0)", lineWidth: 2 });
    ls.setData(result.equityCurve);
    ec.timeScale().fitContent();

    chartRefs.current = { pc, ec };
    const onResize = () => {
      try { pc.applyOptions({ width: pEl.clientWidth, height: Math.max(pEl.clientHeight || 220, 180) }); } catch {}
      try { ec.applyOptions({ width: eEl.clientWidth }); } catch {}
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      try { pc.remove(); } catch {}
      try { ec.remove(); } catch {}
      chartRefs.current = {};
    };
  }, [result, pid, eid]);

  return (
    <div className={styles.charts}>
      <div className={styles.chartLabel}>Price Chart, Real OHLCV Data</div>
      <div id={pid} className={styles.priceChart} />
      <div className={styles.chartLabel}>Equity Curve ($10,000 start)</div>
      <div id={eid} className={styles.equityChart} />
    </div>
  );
}

function TradeTable({ trades }) {
  if (!trades?.length) return null;
  return (
    <div className={styles.tradeLog}>
      <div className={styles.tradeLogHead}>
        <div>Type</div><div>Entry</div><div>Exit</div><div>Pips</div><div>P&amp;L</div><div>Reason</div>
      </div>
      <div className={styles.tradeLogBody}>
        {[...trades].reverse().slice(0, 30).map((t, i) => (
          <div key={i} className={styles.tradeRow}>
            <div className={styles.tradeType} data-type={t.type}>{t.type.toUpperCase()}</div>
            <div>{t.entry.toFixed(5)}</div>
            <div>{t.exit.toFixed(5)}</div>
            <div>{t.pips.toFixed(1)}</div>
            <div data-positive={t.pnl > 0 ? "true" : "false"}>{t.pnl > 0 ? "+" : ""}{t.pnl.toFixed(2)}</div>
            <div>{t.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  return (
    <div className={styles.statsRow}>
      {[
        { label: "Trades",        val: stats.total,                                                                                   icon: <TradeIcon /> },
        { label: "Win Rate",      val: `${stats.winRate}%`,                                                                           icon: <StatsIcon /> },
        { label: "Net P&L",       val: `${parseFloat(stats.netPnl) >= 0 ? "+" : ""}$${stats.netPnl}`, pos: parseFloat(stats.netPnl) >= 0 ? "true" : "false", icon: <PnlIcon /> },
        { label: "Profit Factor", val: stats.pf },
        { label: "Max Drawdown",  val: `${stats.maxDD || 0}%`, pos: "false" },
        { label: "W / L",         val: `${stats.wins} / ${stats.losses}` },
      ].map(({ label, val, icon, pos }, i) => (
        <div key={i} className={styles.statCard}>
          {icon && <div className={styles.statIcon}>{icon}</div>}
          <div className={styles.statBody}>
            <div className={styles.statVal} data-positive={pos}>{val}</div>
            <div className={styles.statLbl}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BotsTab() {
  const {
    isAuth, username, referralCode, referralCount, referralEarnings,
    walletAddress, updateWallet, fetchProfile, requestPayout, fetchPayouts, getAuthHeader,
  } = useAuthStore();
  const { orders: rawOrders, ordersLoading, getMyOrders, downloadBot, deleteOrder, updateVisibility } = useOrderStore();
  const { ads, loaded: adsLoaded, fetchAds } = useAdvertStore();

  const bannerAd = ads.find((a) => a.isActive && a.affiliateLink && a.showBanner);
  const orders   = rawOrders.filter((o) => o.status === "paid" || o.status === "generated" || o.status === "trial" || o.isTrial);

  const [downloadingId,   setDownloadingId]   = useState(null);
  const [deletingId,      setDeletingId]      = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [walletInput,     setWalletInput]     = useState("");
  const [walletSaving,    setWalletSaving]    = useState(false);
  const [walletEditing,   setWalletEditing]   = useState(false);
  const [payouts,         setPayouts]         = useState([]);
  const [payoutRequesting, setPayoutRequesting] = useState(false);
  const [testimonyText,   setTestimonyText]   = useState("");
  const [testimonyRating, setTestimonyRating] = useState(5);
  const [testimonySubmitting, setTestimonySubmitting] = useState(false);
  const [testimonyDone,   setTestimonyDone]   = useState(false);

  const websiteUrl    = typeof window !== "undefined" ? window.location.origin : "https://forexinstincts.com";
  const referralLink  = referralCode ? `${websiteUrl}/authentication/signup?ref=${referralCode}` : "";

  useEffect(() => {
    if (!isAuth) return;
    getMyOrders();
    fetchProfile();
    fetchPayouts().then((r) => { if (r.success) setPayouts(r.data); });
  }, [isAuth, getMyOrders, fetchProfile, fetchPayouts]);

  useEffect(() => { if (!adsLoaded) fetchAds(); }, [adsLoaded, fetchAds]);
  useEffect(() => { setWalletInput(walletAddress || ""); }, [walletAddress]);

  const handleDownload = async (orderId, botName, type) => {
    setDownloadingId(`${orderId}-${type}`);
    try {
      const result = await downloadBot(orderId, type);
      if (result.success) {
        const ext = type === "mt5" ? "mq5" : "mq4";
        const a = document.createElement("a");
        a.href = result.url; a.download = `${botName || "bot"}.${ext}`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(result.url);
        toast.success(`${type.toUpperCase()} file downloaded`);
      } else { toast.error(result.message || "Download failed"); }
    } catch { toast.error("Download failed. Please try again."); }
    finally { setDownloadingId(null); }
  };

  const handleDeleteConfirm = async (orderId) => {
    setDeletingId(orderId); setConfirmDeleteId(null);
    const result = await deleteOrder(orderId);
    if (result.success) toast.success("Bot deleted");
    else toast.error(result.message || "Failed to delete bot");
    setDeletingId(null);
  };

  const handleToggleVisibility = async (orderId, isPublic) => {
    const result = await updateVisibility(orderId, isPublic);
    if (result.success && isPublic) toast.success("Bot is now public and visible in the marketplace.");
    else if (!result.success) toast.error(result.message || "Failed to update visibility");
  };

  const handleCopyReferral = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink)
      .then(() => toast.success("Referral link copied!"))
      .catch(() => toast.error("Copy failed, please copy manually"));
  };

  const handleSaveWallet = async () => {
    if (!walletInput.trim()) { toast.error("Please enter a wallet address"); return; }
    setWalletSaving(true);
    const result = await updateWallet(walletInput.trim());
    setWalletSaving(false);
    if (result.success) { toast.success("Wallet address saved"); setWalletEditing(false); }
    else toast.error(result.message || "Failed to save wallet address");
  };

  const handleRequestPayout = async () => {
    if (!walletAddress) { toast.error("Please add a wallet address first"); return; }
    if ((referralEarnings || 0) <= 0) { toast.error("No balance available to withdraw"); return; }
    setPayoutRequesting(true);
    const result = await requestPayout();
    setPayoutRequesting(false);
    if (result.success) {
      toast.success("Payout request submitted. We will process it within 48 hours.");
      setPayouts((prev) => [result.data, ...prev]);
    } else { toast.error(result.message || "Failed to submit payout request"); }
  };

  const handleTestimonySubmit = async () => {
    if (!testimonyText.trim()) { toast.error("Please write your experience before submitting"); return; }
    setTestimonySubmitting(true);
    try {
      const res = await fetch(`${SERVER_API}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ name: username || "Anonymous", content: testimonyText, rating: testimonyRating }),
      });
      const data = await res.json();
      if (data.success) { toast.success("Thank you! Your testimonial has been submitted for review."); setTestimonyDone(true); }
      else toast.error(data.message || "Submission failed");
    } catch { toast.error("Submission failed. Please try again."); }
    finally { setTestimonySubmitting(false); }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.botsShell}>

        {/* body: main scroll + sidebar */}
        <div className={styles.botsBody}>

          {/* left: bot grid + guide + testimony */}
          <div className={styles.botsMain}>
            <div className={styles.botsTopRow}>
              <div>
                <h1 className={styles.botsTopTitle}>My Trading Bots</h1>
                <p className={styles.botsTopSub}>Welcome back, {username || "Trader"}. Backtest, deploy, or download your bots.</p>
              </div>
              <Link href="/tiers" className={dashStyles.buildNewBtn}><RocketIcon /><span>Build New Bot</span></Link>
            </div>
            {ordersLoading ? (
              <div className={styles.botsEmpty}>
                <div className={styles.spinner} />
                <p>Loading your bots...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.botsEmpty}>
                <CodeIcon />
                <h3>Add your first bot</h3>
                <p>Build your first automated trading bot to get started</p>
                <Link href="/tiers" className={dashStyles.emptyBuildBtn}><RocketIcon /><span>Get Started</span></Link>
              </div>
            ) : (
              <div className={styles.botsGrid}>
                {orders.map((order) => (
                  <BotCard
                    key={order._id}
                    variant="dashboard"
                    order={order}
                    onDownload={handleDownload}
                    onDelete={(id) => setConfirmDeleteId(id)}
                    onToggleVisibility={handleToggleVisibility}
                    downloadingId={downloadingId}
                    deletingId={deletingId}
                    confirmDeleteId={confirmDeleteId}
                    onConfirmDelete={handleDeleteConfirm}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                  />
                ))}
              </div>
            )}

            <BotInstallGuide />

            <div className={dashStyles.testimonySection}>
              <div className={dashStyles.testimonySectionHeader}>
                <div className={dashStyles.testimonyIcon}><TestimonyIcon /></div>
                <div>
                  <h2>Share Your Experience</h2>
                  <p>Help other traders by sharing your ForexInstincts story</p>
                </div>
              </div>
              {testimonyDone ? (
                <div className={dashStyles.testimonySuccess}><CheckIconSolid /><p>Thank you! Your testimonial has been submitted and will appear once approved.</p></div>
              ) : (
                <div className={dashStyles.testimonyForm}>
                  <div className={dashStyles.starRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className={dashStyles.star} onClick={() => setTestimonyRating(star)}>
                        {star <= testimonyRating ? <StarFilledIcon /> : <StarEmptyIcon />}
                      </div>
                    ))}
                  </div>
                  <textarea className={dashStyles.testimonyTextarea} placeholder="Tell us about your experience building bots with ForexInstincts..." value={testimonyText} onChange={(e) => setTestimonyText(e.target.value)} rows={4} />
                  <button className={dashStyles.testimonySubmitBtn} onClick={handleTestimonySubmit} disabled={testimonySubmitting}>{testimonySubmitting ? "Submitting..." : "Submit Testimonial"}</button>
                </div>
              )}
            </div>
          </div>

          {/* right sidebar: scrollable content + pinned ad */}
          <div className={styles.botsSidebar}>

            <div className={styles.botsSidebarScroll}>

              <div className={styles.botsStatsBar}>
                <div className={styles.botsStatItem}>
                  <EarningsIcon />
                  <div>
                    <div className={styles.botsStatValue}>${(referralEarnings || 0).toFixed(2)}</div>
                    <div className={styles.botsStatLabel}>Balance</div>
                  </div>
                </div>
                <div className={styles.botsStatItem}>
                  <PeopleIcon />
                  <div>
                    <div className={styles.botsStatValue}>{referralCount || 0}</div>
                    <div className={styles.botsStatLabel}>Referrals</div>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarSectionTitle}><PeopleIcon />Referral Program</div>
                <div className={dashStyles.referralLinkRow}>
                  <div className={dashStyles.referralLinkBox}><span>{referralLink || "Loading..."}</span></div>
                  <button className={dashStyles.copyBtn} onClick={handleCopyReferral} disabled={!referralLink}><CopyIcon /></button>
                </div>
                <div className={dashStyles.referralRates}>
                  <div className={dashStyles.rateRow}><span>1–4 referrals</span><span>10%</span></div>
                  <div className={dashStyles.rateRow}><span>5–9 referrals</span><span>12%</span></div>
                  <div className={dashStyles.rateRow}><span>10–19 referrals</span><span>15%</span></div>
                  <div className={dashStyles.rateRow}><span>20+ referrals</span><span>20%</span></div>
                </div>
                <p className={dashStyles.referralNote}>50% of sale price when someone buys your marketplace bot.</p>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarSectionTitle}><WalletIcon />Payout Wallet</div>
                <div className={dashStyles.walletWarning}>Double-check your wallet address. Incorrect addresses result in permanent loss of funds.</div>
                {walletAddress && !walletEditing ? (
                  <div className={dashStyles.walletDisplay}>
                    <span className={dashStyles.walletAddr}>{walletAddress}</span>
                    <button className={dashStyles.editWalletBtn} onClick={() => setWalletEditing(true)}>Change</button>
                  </div>
                ) : (
                  <div className={dashStyles.walletInputRow}>
                    <input className={dashStyles.walletInput} type="text" placeholder="Enter your crypto wallet address" value={walletInput} onChange={(e) => setWalletInput(e.target.value)} maxLength={120} />
                    <button className={dashStyles.saveWalletBtn} onClick={handleSaveWallet} disabled={walletSaving}>{walletSaving ? "Saving..." : "Save"}</button>
                    {walletEditing && <button className={dashStyles.cancelWalletBtn} onClick={() => { setWalletEditing(false); setWalletInput(walletAddress || ""); }}>Cancel</button>}
                  </div>
                )}
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarSectionTitle}><EarningsIcon />Payouts</div>
                <div className={dashStyles.payoutRequestRow}>
                  <div className={dashStyles.payoutBalance}>
                    <span className={dashStyles.payoutBalanceLabel}>Available</span>
                    <span className={dashStyles.payoutBalanceAmount}>${(referralEarnings || 0).toFixed(2)}</span>
                  </div>
                  <button className={dashStyles.payoutRequestBtn} onClick={handleRequestPayout} disabled={payoutRequesting || (referralEarnings || 0) <= 0 || !walletAddress}>
                    {payoutRequesting ? "Requesting..." : "Request"}
                  </button>
                </div>
                {payouts.length > 0 && (
                  <div className={dashStyles.payoutHistory}>
                    <h3 className={dashStyles.payoutHistoryTitle}>History</h3>
                    {payouts.map((p) => (
                      <div key={p._id} className={dashStyles.payoutItem}>
                        <div className={dashStyles.payoutItemTop}>
                          <span className={dashStyles.payoutAmount}>${(p.amount || 0).toFixed(2)}</span>
                          <span className={dashStyles.payoutStatus} data-status={p.status}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                        </div>
                        <div className={dashStyles.payoutItemMeta}>
                          <span className={dashStyles.payoutWallet}>{p.walletAddress}</span>
                          <span className={dashStyles.payoutDate}>{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        {p.proofNote && <div className={dashStyles.payoutProof}><span className={dashStyles.payoutProofLabel}>Receipt:</span><span className={dashStyles.payoutProofText}>{p.proofNote}</span></div>}
                      </div>
                    ))}
                  </div>
                )}
                {payouts.length === 0 && <p className={dashStyles.payoutEmpty}>No payout requests yet.</p>}
              </div>

            </div>

            {bannerAd && (
              <div className={styles.botsSidebarAd}>
                <AdCard ad={bannerAd} variant="banner" />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function BacktestTab() {
  const { orders, ordersLoading, getMyOrders } = useOrderStore();
  const [selectedBot, setSelectedBot] = useState(null);
  const [period,      setPeriod]      = useState(PERIODS[0]);
  const [sl,          setSl]          = useState(50);
  const [tp,          setTp]          = useState(100);
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => { getMyOrders(); }, [getMyOrders]);

  const botConfig  = selectedBot?.config || {};
  const botSymbol  = SYMBOLS.find((s) => (s.from + s.to) === (botConfig.symbol || "")) || null;
  const botStrat   = botConfig.entry?.strategy || "ma_crossover";
  const botOptions = orders.map((o) => ({ value: o._id, name: o.botName || "Unnamed Bot" }));

  useEffect(() => {
    if (!selectedBot) return;
    const cfg = selectedBot.config || {};
    const risk = cfg.riskManagement || cfg.risk || {};
    if (risk.stopLoss)  setSl(risk.stopLoss);
    if (risk.takeProfit) setTp(risk.takeProfit);
  }, [selectedBot]);

  const run = useCallback(async () => {
    if (!selectedBot || !botSymbol) { setError("Select a valid bot to run a backtest."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const all    = await fetchAVCandles(botSymbol.from, botSymbol.to, period.avSize);
      const sliced = all.slice(-period.days);
      if (sliced.length < 52) throw new Error("Not enough candle data returned. Try again later.");
      setResult(runBacktest(sliced, botStrat, Number(sl), Number(tp), period.tradeWindow));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [selectedBot, botSymbol, botStrat, period, sl, tp]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.backtestShell}>

        {/* settings panel */}
        <div className={styles.backtestSettingsPanel}>
          <div className={styles.settingGroup}>
            <label>Your Bot</label>
            {ordersLoading ? (
              <div className={styles.loadingPill}><div className={styles.spinnerSm} />Loading bots...</div>
            ) : orders.length === 0 ? (
              <div className={styles.emptyBots}>
                <p>No bots found.</p>
                <Link href="/tiers" className={styles.emptyBotsLink}>Build Your First Bot →</Link>
              </div>
            ) : (
              <Dropdown
                options={botOptions}
                value={botOptions.find((o) => o.value === selectedBot?._id) || null}
                onSelect={(opt) => { setSelectedBot(orders.find((o) => o._id === opt.value)); setResult(null); setError(""); }}
                dropPlaceHolder="Select a bot to backtest"
              />
            )}
          </div>

          {selectedBot && (
            <div className={styles.botInfoCard}>
              <div className={styles.botInfoRow}><span>Symbol</span><strong>{botSymbol?.label || botConfig.symbol || "—"}</strong></div>
              <div className={styles.botInfoRow}><span>Strategy</span><strong>{STRATEGIES.find((s) => s.value === botStrat)?.label || botStrat}</strong></div>
              <div className={styles.botInfoRow}><span>SL</span><strong>{sl} pips</strong></div>
              <div className={styles.botInfoRow}><span>TP</span><strong>{tp} pips</strong></div>
              {!botSymbol && <div className={styles.botInfoRow} data-warn="true"><span>Note</span><strong>{botConfig.symbol} not supported</strong></div>}
            </div>
          )}

          <div className={styles.settingGroup}>
            <label>Period</label>
            <Dropdown
              options={PERIOD_OPTS}
              value={PERIOD_OPTS.find((o) => o.value === period.label) || null}
              onSelect={(opt) => setPeriod(PERIODS.find((p) => p.label === opt.value))}
              dropPlaceHolder="Select period"
            />
          </div>

          <button className={styles.runBtn} onClick={run} disabled={loading || !selectedBot || !botSymbol}>
            <RunIcon /><span>{loading ? "Fetching..." : "Run Backtest"}</span>
          </button>
        </div>

        {/* results area */}
        <div className={styles.backtestResultsShell}>
          {(!result || loading || error) ? (
            <div className={styles.backtestEmptyZone}>
              {loading  && <><div className={styles.spinner} /><p>Fetching OHLCV data from Alpha Vantage...</p></>}
              {error    && <div className={styles.errorBox}><WarnIcon /><p>{error}</p></div>}
              {!loading && !error && <><ChartIcon /><p>{!selectedBot ? "Select one of your bots to backtest its strategy against real historical data." : "Select a period and click Run Backtest. SL/TP come from your bot config."}</p></>}
            </div>
          ) : (
            <>
              <div className={styles.backtestStatsWrap}>
                <StatsRow stats={result.stats} />
              </div>
              <div className={styles.backtestChartZone}>
                <BacktestCharts result={result} idSuffix="_av" />
              </div>
              <div className={styles.backtestTradeZone}>
                <TradeTable trades={result.trades} />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function TVTab() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tvShell}>

        {/* chart hero, fills all available height */}
        <div className={styles.tvHeroZone}>
          <div className={styles.tvTerminal}>
            <TradingViewChart />
          </div>
        </div>

        {/* scrollable info below */}
        <div className={styles.tvScrollZone}>
          <div className={styles.tvFeatureGrid}>
            {[
              { title: "Real Chart Backtesting",  body: "TradingView's Strategy Tester runs your Pine Script against real tick data from any broker." },
              { title: "Paper Trading Mode",      body: "Simulate live trades with Paper Trading, zero risk, live prices, perfect for validation." },
              { title: "Live Broker Execution",   body: "Capital.com, Interactive Brokers, and Tradovate support live execution directly from Pine Script alerts." },
              { title: "Webhook Alerts",          body: "Fire strategy alerts to any service via TradingView webhooks, automate without MetaTrader." },
            ].map(({ title, body }) => (
              <div key={title} className={styles.tvFeatureCard}><h4>{title}</h4><p>{body}</p></div>
            ))}
          </div>

          <div className={styles.tvSteps}>
            <h3>How to deploy your Pine Script bot</h3>
            {[
              'Build your bot, choose TradingView as the platform.',
              'Go to My Bots tab and click "Copy Pine Script" on your bot card.',
              "Open the Pine Editor (bottom toolbar above) → paste your code → Save.",
              "Add to any chart via Indicators → My Scripts. Open Strategy Tester to backtest.",
              "For live trading: create an Alert on the strategy → enable broker integration or webhook.",
            ].map((step, i) => (
              <div key={i} className={styles.deployStep}>
                <div className={styles.deployStepNum}>{i + 1}</div>
                <div className={styles.deployStepBody}><p>{step}</p></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function CapitalTab() {
  const { ads, loaded: adsLoaded, fetchAds } = useAdvertStore();
  useEffect(() => { if (!adsLoaded) fetchAds(); }, [adsLoaded, fetchAds]);
  const capitalAd = ads.find((a) => a.isActive && a.affiliateLink && a.showTerminal);

  const [apiKey,        setApiKey]        = useState("");
  const [identifier,    setIdentifier]    = useState("");
  const [password,      setPassword]      = useState("");
  const [cst,           setCst]           = useState("");
  const [securityToken, setSecurityToken] = useState("");
  const [accountId,     setAccountId]     = useState("");
  const [env,           setEnv]           = useState("practice");
  const [accounts,      setAccounts]      = useState([]);
  const [account,       setAccount]       = useState(null);
  const [positions,     setPositions]     = useState([]);
  const [connecting,    setConnecting]    = useState(false);
  const [connected,     setConnected]     = useState(false);
  const [connError,     setConnError]     = useState("");
  const [symbol,        setSymbol]        = useState(SYMBOLS[0]);
  const [pricing,       setPricing]       = useState(null);
  const pricingTimer = useRef(null);
  const [period,    setPeriod]    = useState(PERIODS[0]);
  const [strategy,  setStrategy]  = useState("ma_crossover");
  const [sl,        setSl]        = useState(50);
  const [tp,        setTp]        = useState(100);
  const [btResult,  setBtResult]  = useState(null);
  const [btLoading, setBtLoading] = useState(false);
  const [btError,   setBtError]   = useState("");
  const [orderSide,  setOrderSide]  = useState("buy");
  const [orderUnits, setOrderUnits] = useState(1000);
  const [orderSl,    setOrderSl]    = useState("");
  const [orderTp,    setOrderTp]    = useState("");
  const [ordering,         setOrdering]         = useState(false);
  const [liveOrderConfirm, setLiveOrderConfirm] = useState(false);
  const [closeConfirmId,   setCloseConfirmId]   = useState(null);

  const post = useCallback((path, body) =>
    fetch(`${SERVER_API}/capital/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
  []);

  const auth = useCallback(() => ({ apiKey, cst, securityToken }), [apiKey, cst, securityToken]);

  const fetchPricing = useCallback(async () => {
    if (!cst || !securityToken) return;
    try {
      const data = await post("pricing", { ...auth(), env, instruments: symbol.capital });
      if (data.success && data.data?.length) setPricing(data.data[0]);
    } catch {}
  }, [cst, securityToken, env, symbol, post, auth]);

  useEffect(() => {
    if (!connected) { clearInterval(pricingTimer.current); return; }
    fetchPricing();
    pricingTimer.current = setInterval(fetchPricing, 30000);
    return () => clearInterval(pricingTimer.current);
  }, [connected, fetchPricing]);

  const connect = useCallback(async () => {
    if (!identifier.trim()) { setConnError("Enter your Capital.com email"); return; }
    if (!password.trim())   { setConnError("Enter your Capital.com password"); return; }
    if (!apiKey.trim())     { setConnError("Enter your Capital.com API key"); return; }
    setConnecting(true); setConnError("");
    try {
      const data = await post("session", { apiKey, identifier, password, env });
      if (!data.success) throw new Error(data.message);
      setCst(data.cst);
      setSecurityToken(data.securityToken);
      setAccounts(data.data);
      if (data.data.length === 1) {
        setAccountId(data.data[0].id);
        // auto-load with freshly returned tokens
        const id = data.data[0].id;
        const [accData, posData] = await Promise.all([
          post("account",   { apiKey, cst: data.cst, securityToken: data.securityToken, accountId: id, env }),
          post("positions", { apiKey, cst: data.cst, securityToken: data.securityToken, accountId: id, env }),
        ]);
        if (accData.success) {
          setAccount(accData.data);
          setPositions(posData.success ? posData.data : []);
          setConnected(true);
        }
      }
    } catch (e) { setConnError(e.message); }
    finally { setConnecting(false); }
  }, [apiKey, identifier, password, env, post]);

  const loadAccount = useCallback(async (aid) => {
    const id = aid || accountId;
    if (!id || !cst || !securityToken) return;
    setConnecting(true); setConnError("");
    try {
      const [accData, posData] = await Promise.all([
        post("account",   { ...auth(), accountId: id, env }),
        post("positions", { ...auth(), accountId: id, env }),
      ]);
      if (!accData.success) throw new Error(accData.message);
      setAccount(accData.data);
      setPositions(posData.success ? posData.data : []);
      setConnected(true);
    } catch (e) { setConnError(e.message); }
    finally { setConnecting(false); }
  }, [cst, securityToken, accountId, env, post, auth]);

  const runCapitalBt = useCallback(async () => {
    setBtLoading(true); setBtError(""); setBtResult(null);
    try {
      const data = await post("backtest", { ...auth(), env, symbol: symbol.capital, timeframe: period.capitalTf, count: period.capitalCount, tradeWindow: period.tradeWindow, strategy, sl: Number(sl), tp: Number(tp) });
      if (!data.success) throw new Error(data.message);
      setBtResult(data.data);
    } catch (e) { setBtError(e.message); }
    finally { setBtLoading(false); }
  }, [cst, securityToken, env, symbol, period, strategy, sl, tp, post, auth]);

  const placeOrder = useCallback(async () => {
    if (env === "live" && !liveOrderConfirm) { setLiveOrderConfirm(true); return; }
    setLiveOrderConfirm(false);
    setOrdering(true);
    try {
      const data = await post("order", { ...auth(), accountId, env, symbol: symbol.capital, units: Number(orderUnits), direction: orderSide === "buy" ? "BUY" : "SELL", stopLoss: orderSl || undefined, takeProfit: orderTp || undefined });
      if (!data.success) throw new Error(data.message);
      toast.success("Order placed!");
      loadAccount();
    } catch (e) { toast.error(e.message); }
    finally { setOrdering(false); }
  }, [env, liveOrderConfirm, cst, securityToken, accountId, symbol, orderSide, orderUnits, orderSl, orderTp, post, auth, loadAccount]);

  const closePosition = useCallback(async (tradeId) => {
    if (env === "live" && closeConfirmId !== tradeId) { setCloseConfirmId(tradeId); return; }
    setCloseConfirmId(null);
    try {
      const data = await post("close", { ...auth(), accountId, env, tradeId });
      if (!data.success) throw new Error(data.message);
      toast.success("Position closed");
      loadAccount();
    } catch (e) { toast.error(e.message); }
  }, [env, closeConfirmId, cst, securityToken, accountId, post, auth, loadAccount]);

  const pip    = symbol.capital === "GOLD" ? 0.01 : symbol.capital.includes("JPY") ? 0.01 : 0.0001;
  const bid    = pricing ? parseFloat(pricing.bids?.[0]?.price || 0) : 0;
  const ask    = pricing ? parseFloat(pricing.asks?.[0]?.price || 0) : 0;
  const spread = pricing ? ((ask - bid) / pip).toFixed(1) : null;
  const prec   = symbol.capital === "GOLD" ? 2 : symbol.capital.includes("JPY") ? 3 : 5;
  const accountOpts = accounts.map((a) => ({ value: a.id, name: a.name || a.id }));

  return (
    <div className={styles.tabContent}>
      <div className={styles.capitalShell}>

        {/* top section: chart + control panel, fills viewport height */}
        <div className={styles.capitalTopSection}>
          <div className={styles.capitalChartCol}>
            <div className={styles.tvTerminal}>
              <TradingViewChart symbol={symbol.tv} />
            </div>
            {connected && pricing && (
              <div className={styles.livePriceTicker}>
                <LiveIcon className={styles.liveIcon} />
                <span className={styles.tickerPair}>{symbol.label}</span>
                <span className={styles.tickerBid}>Bid <strong>{bid.toFixed(prec)}</strong></span>
                <span className={styles.tickerAsk}>Ask <strong>{ask.toFixed(prec)}</strong></span>
                {spread && <span className={styles.tickerSpread}>Spread <strong>{spread}</strong></span>}
                <span className={styles.tickerStatus} data-tradeable={pricing.tradeable ? "true" : "false"}>
                  {pricing.tradeable ? "● Market Open" : "● Market Closed"}
                </span>
              </div>
            )}
          </div>
          <div className={styles.capitalControlCol}>
          <div className={styles.capitalConnect}>
            <div className={styles.capitalConnectHead}>
              <div className={styles.connectIcon}><WalletIcon /></div>
              <div>
                <h2>Connect Capital.com</h2>
                <p>Link your practice or live account to trade directly from this dashboard.</p>
              </div>
            </div>
            <div className={styles.capitalForm}>
              <div className={styles.settingGroup}>
                <label>Environment</label>
                <Dropdown
                  options={ENV_OPTS}
                  value={ENV_OPTS.find((o) => o.value === env) || null}
                  onSelect={(opt) => { setEnv(opt.value); setConnected(false); setAccount(null); setAccounts([]); setPricing(null); setCst(""); setSecurityToken(""); }}
                  dropPlaceHolder="Select environment"
                />
              </div>
              <div className={styles.settingGroup}>
                <label>Email</label>
                <div className={authStyles.authInput}>
                  <WalletIcon className={authStyles.authIcon} />
                  <input type="email" placeholder="your@email.com" value={identifier} onChange={(e) => { setIdentifier(e.target.value); setConnected(false); }} />
                </div>
              </div>
              <div className={styles.settingGroup}>
                <label>Password / API Key Password</label>
                <div className={authStyles.authInput}>
                  <KeyIcon className={authStyles.authIcon} />
                  <input type="password" placeholder="Account password, or custom API key password if set" value={password} onChange={(e) => { setPassword(e.target.value); setConnected(false); }} />
                </div>
              </div>
              <div className={styles.settingGroup}>
                <label>API Key</label>
                <div className={authStyles.authInput}>
                  <KeyIcon className={authStyles.authIcon} />
                  <input type="password" placeholder="Capital.com API key" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setConnected(false); }} />
                </div>
              </div>
              {accounts.length > 1 && (
                <div className={styles.settingGroup}>
                  <label>Account</label>
                  <Dropdown
                    options={accountOpts}
                    value={accountOpts.find((o) => o.value === accountId) || null}
                    onSelect={(opt) => setAccountId(opt.value)}
                    dropPlaceHolder="Select account"
                  />
                </div>
              )}
              {accounts.length === 0 ? (
                <button className={styles.runBtn} onClick={connect} disabled={connecting}>
                  <LinkIcon /><span>{connecting ? "Connecting..." : "Connect Account"}</span>
                </button>
              ) : (
                <button className={styles.runBtn} onClick={() => loadAccount()} disabled={connecting || !accountId}>
                  <CheckIcon /><span>{connecting ? "Loading..." : "Load Account"}</span>
                </button>
              )}
              {connError && <div className={styles.capitalError}><WarnIcon /><span>{connError}</span></div>}
            </div>
            <div className={styles.capitalApiNote}>
              <p>Get your API key: log in at <strong>capital.com</strong> → <strong>Settings &rarr; API Integrations &rarr; Generate key</strong>. If you set a <strong>custom password</strong> on the key, enter that in the password field above, otherwise use your account login password.</p>
            </div>
            <div className={styles.trustNote}>
              <CheckIconSolid /><span>Your credentials are sent directly to Capital.com and never stored on our servers</span>
            </div>
          </div>

          {connected && account && (
            <div className={styles.capitalAccountBox}>
              <div className={styles.capitalAccountGrid}>
                {[
                  { label: "Balance",        val: `${account.currency} ${account.balance.toFixed(2)}` },
                  { label: "NAV",            val: `${account.currency} ${account.nav.toFixed(2)}` },
                  { label: "Unrealized P&L", val: `${account.unrealizedPL >= 0 ? "+" : ""}${account.unrealizedPL.toFixed(2)}`, pos: account.unrealizedPL >= 0 ? "true" : "false" },
                  { label: "Open Trades",    val: account.openTradeCount },
                  { label: "Margin Used",    val: `${account.currency} ${account.marginUsed.toFixed(2)}` },
                  { label: "Margin Free",    val: `${account.currency} ${account.marginAvailable.toFixed(2)}` },
                ].map(({ label, val, pos }) => (
                  <div key={label} className={styles.capitalStat}>
                    <div className={styles.statVal} data-positive={pos}>{val}</div>
                    <div className={styles.statLbl}>{label}</div>
                  </div>
                ))}
              </div>
              <div className={styles.capitalSectionTitle}>
                Quick Order
                <span className={styles.envBadge} data-env={env}>{env === "live" ? "Live Account" : "Demo Account"}</span>
              </div>
              {env === "live" && (
                <div className={styles.liveWarningBanner}>
                  You are connected to a LIVE account. Orders placed here will execute real trades with real money.
                </div>
              )}
              <div className={styles.orderForm}>
                <div className={styles.orderSideRow}>
                  <button className={styles.orderSideBtn} data-active={orderSide === "buy" ? "true" : "false"} data-side="buy" onClick={() => setOrderSide("buy")}><BuyIcon /> Buy</button>
                  <button className={styles.orderSideBtn} data-active={orderSide === "sell" ? "true" : "false"} data-side="sell" onClick={() => setOrderSide("sell")}><SellIcon /> Sell</button>
                </div>
                <div className={styles.settingGroup}>
                  <label>Units</label>
                  <div className={authStyles.authInput}>
                    <TradeIcon className={authStyles.authIcon} />
                    <input type="number" min={100} max={1000000} value={orderUnits} onChange={(e) => setOrderUnits(e.target.value)} />
                  </div>
                </div>
                <div className={styles.settingGroup}>
                  <label>Stop Loss Price (optional)</label>
                  <div className={authStyles.authInput}>
                    <WarnIcon className={authStyles.authIcon} />
                    <input type="number" step="0.00001" placeholder="e.g. 1.08000" value={orderSl} onChange={(e) => setOrderSl(e.target.value)} />
                  </div>
                </div>
                <div className={styles.settingGroup}>
                  <label>Take Profit Price (optional)</label>
                  <div className={authStyles.authInput}>
                    <CheckIcon className={authStyles.authIcon} />
                    <input type="number" step="0.00001" placeholder="e.g. 1.10000" value={orderTp} onChange={(e) => setOrderTp(e.target.value)} />
                  </div>
                </div>
                {liveOrderConfirm ? (
                  <div className={styles.liveOrderConfirm}>
                    <p className={styles.liveOrderConfirmText}>
                      Confirm: place a real {orderSide.toUpperCase()} order for {Number(orderUnits).toLocaleString()} {symbol.label} on your live account?
                    </p>
                    <div className={styles.liveOrderConfirmBtns}>
                      <button className={styles.liveOrderConfirmYes} onClick={placeOrder} disabled={ordering}>
                        {ordering ? "Placing..." : "Yes, Place Order"}
                      </button>
                      <button className={styles.liveOrderConfirmNo} onClick={() => setLiveOrderConfirm(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.runBtn} onClick={placeOrder} disabled={ordering}>
                    {ordering ? "Placing..." : `${orderSide === "buy" ? "Buy" : "Sell"} ${Number(orderUnits).toLocaleString()} ${symbol.label}`}
                  </button>
                )}
              </div>
              {positions.length > 0 && (
                <div className={styles.positionsBox}>
                  <div className={styles.capitalSectionTitle}>
                    Open Positions
                    <button className={styles.refreshBtn} onClick={() => loadAccount()}><RefreshIcon /></button>
                  </div>
                  {positions.map((p) => (
                    <div key={p.id} className={styles.positionRow}>
                      <div className={styles.posInstrument}>{p.instrument.replace("_", "/")}</div>
                      <div data-positive={p.units > 0 ? "true" : "false"}>{p.units > 0 ? "+" : ""}{p.units}</div>
                      <div>{p.openPrice}</div>
                      <div data-positive={p.unrealizedPL >= 0 ? "true" : "false"}>{p.unrealizedPL >= 0 ? "+" : ""}{p.unrealizedPL.toFixed(2)}</div>
                      {closeConfirmId === p.id ? (
                        <div className={styles.posConfirmRow}>
                          <button className={styles.posConfirmYes} onClick={() => closePosition(p.id)}>Close</button>
                          <button className={styles.posConfirmNo} onClick={() => setCloseConfirmId(null)}>No</button>
                        </div>
                      ) : (
                        <button className={styles.closePosBtn} onClick={() => closePosition(p.id)}><CloseIcon /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {capitalAd && (
            <div className={styles.capitalAdSlot}>
              <AdCard ad={capitalAd} variant="terminal" />
            </div>
          )}
        </div>
        </div>{/* end capitalTopSection */}

        {/* Capital.com backtest below, natural scroll */}
        {connected && (
          <div className={styles.capitalBtSection}>
            <div className={styles.capitalSectionTitle}>Backtest with Real Capital.com Data</div>
            <div className={styles.backtestShell}>
              <div className={styles.backtestSettingsPanel}>
                <div className={styles.settingGroup}>
                  <label>Symbol</label>
                  <Dropdown options={SYMBOL_OPTS} value={SYMBOL_OPTS.find((o) => o.value === symbol.label) || null} onSelect={(opt) => setSymbol(SYMBOLS.find((s) => s.label === opt.value))} dropPlaceHolder="Select symbol" />
                </div>
                <div className={styles.settingGroup}>
                  <label>Period</label>
                  <Dropdown options={PERIOD_OPTS} value={PERIOD_OPTS.find((o) => o.value === period.label) || null} onSelect={(opt) => setPeriod(PERIODS.find((p) => p.label === opt.value))} dropPlaceHolder="Select period" />
                </div>
                <div className={styles.settingGroup}>
                  <label>Strategy</label>
                  <Dropdown options={STRATEGY_OPTS} value={STRATEGY_OPTS.find((o) => o.value === strategy) || null} onSelect={(opt) => setStrategy(opt.value)} dropPlaceHolder="Select strategy" />
                </div>
                <div className={styles.settingGroup}>
                  <label>SL (pips)</label>
                  <div className={authStyles.authInput}><WarnIcon className={authStyles.authIcon} /><input type="number" min={5} value={sl} onChange={(e) => setSl(e.target.value)} /></div>
                </div>
                <div className={styles.settingGroup}>
                  <label>TP (pips)</label>
                  <div className={authStyles.authInput}><CheckIcon className={authStyles.authIcon} /><input type="number" min={5} value={tp} onChange={(e) => setTp(e.target.value)} /></div>
                </div>
                <button className={styles.runBtn} onClick={runCapitalBt} disabled={btLoading}>
                  <RunIcon /><span>{btLoading ? "Running..." : "Run Backtest"}</span>
                </button>
              </div>
              <div className={styles.backtestResultsShell}>
                {(!btResult || btLoading || btError) ? (
                  <div className={styles.backtestEmptyZone}>
                    {btLoading && <><div className={styles.spinner} /><p>Fetching Capital.com candles...</p></>}
                    {btError  && <div className={styles.errorBox}><WarnIcon /><p>{btError}</p></div>}
                    {!btLoading && !btError && <><ChartIcon /><p>Run a backtest with your real Capital.com candle data.</p></>}
                  </div>
                ) : (
                  <>
                    <div className={styles.backtestStatsWrap}><StatsRow stats={btResult.stats} /></div>
                    <div className={styles.backtestChartZone}><BacktestCharts result={btResult} idSuffix="_capital" /></div>
                    <div className={styles.backtestTradeZone}><TradeTable trades={btResult.trades} /></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>{/* end capitalShell */}
    </div>
  );
}

function OandaTab() {
  const { ads, loaded: adsLoaded, fetchAds } = useAdvertStore();
  useEffect(() => { if (!adsLoaded) fetchAds(); }, [adsLoaded, fetchAds]);
  const oandaAd = ads.find((a) => a.isActive && a.affiliateLink && a.showTerminal);

  const [apiKey,        setApiKey]        = useState("");
  const [env,           setEnv]           = useState("practice");
  const [accountId,     setAccountId]     = useState("");
  const [accounts,      setAccounts]      = useState([]);
  const [account,       setAccount]       = useState(null);
  const [positions,     setPositions]     = useState([]);
  const [connecting,    setConnecting]    = useState(false);
  const [connected,     setConnected]     = useState(false);
  const [connError,     setConnError]     = useState("");
  const [symbol,        setSymbol]        = useState(SYMBOLS[0]);
  const [pricing,       setPricing]       = useState(null);
  const pricingTimer = useRef(null);
  const [period,    setPeriod]    = useState(PERIODS[0]);
  const [strategy,  setStrategy]  = useState("ma_crossover");
  const [sl,        setSl]        = useState(50);
  const [tp,        setTp]        = useState(100);
  const [btResult,  setBtResult]  = useState(null);
  const [btLoading, setBtLoading] = useState(false);
  const [btError,   setBtError]   = useState("");
  const [orderSide,  setOrderSide]  = useState("buy");
  const [orderUnits, setOrderUnits] = useState(1000);
  const [orderSl,    setOrderSl]    = useState("");
  const [orderTp,    setOrderTp]    = useState("");
  const [ordering,         setOrdering]         = useState(false);
  const [liveOrderConfirm, setLiveOrderConfirm] = useState(false);
  const [closeConfirmId,   setCloseConfirmId]   = useState(null);

  const post = useCallback((path, body) =>
    fetch(`${SERVER_API}/oanda/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
  []);

  const fetchPricing = useCallback(async () => {
    if (!apiKey || !accountId) return;
    try {
      const data = await post("pricing", { apiKey, accountId, env, instruments: symbol.oanda });
      if (data.success && data.data?.length) setPricing(data.data[0]);
    } catch {}
  }, [apiKey, accountId, env, symbol, post]);

  useEffect(() => {
    if (!connected) { clearInterval(pricingTimer.current); return; }
    fetchPricing();
    pricingTimer.current = setInterval(fetchPricing, 30000);
    return () => clearInterval(pricingTimer.current);
  }, [connected, fetchPricing]);

  const connect = useCallback(async () => {
    if (!apiKey.trim()) { setConnError("Enter your OANDA API key"); return; }
    setConnecting(true); setConnError("");
    try {
      const data = await post("connect", { apiKey, env });
      if (!data.success) throw new Error(data.message);
      setAccounts(data.data);
      if (data.data.length === 1) {
        const id = data.data[0].id;
        setAccountId(id);
        const [accData, posData] = await Promise.all([
          post("account",   { apiKey, accountId: id, env }),
          post("positions", { apiKey, accountId: id, env }),
        ]);
        if (accData.success) {
          setAccount(accData.data);
          setPositions(posData.success ? posData.data : []);
          setConnected(true);
        }
      }
    } catch (e) { setConnError(e.message); }
    finally { setConnecting(false); }
  }, [apiKey, env, post]);

  const loadAccount = useCallback(async (aid) => {
    const id = aid || accountId;
    if (!id || !apiKey) return;
    setConnecting(true); setConnError("");
    try {
      const [accData, posData] = await Promise.all([
        post("account",   { apiKey, accountId: id, env }),
        post("positions", { apiKey, accountId: id, env }),
      ]);
      if (!accData.success) throw new Error(accData.message);
      setAccount(accData.data);
      setPositions(posData.success ? posData.data : []);
      setConnected(true);
    } catch (e) { setConnError(e.message); }
    finally { setConnecting(false); }
  }, [apiKey, accountId, env, post]);

  const runOandaBt = useCallback(async () => {
    setBtLoading(true); setBtError(""); setBtResult(null);
    try {
      const data = await post("backtest", { apiKey, env, symbol: symbol.oanda, timeframe: period.oandaTf, count: period.oandaCount, tradeWindow: period.tradeWindow, strategy, sl: Number(sl), tp: Number(tp) });
      if (!data.success) throw new Error(data.message);
      setBtResult(data.data);
    } catch (e) { setBtError(e.message); }
    finally { setBtLoading(false); }
  }, [apiKey, env, symbol, period, strategy, sl, tp, post]);

  const placeOrder = useCallback(async () => {
    if (env === "live" && !liveOrderConfirm) { setLiveOrderConfirm(true); return; }
    setLiveOrderConfirm(false);
    setOrdering(true);
    try {
      const data = await post("order", { apiKey, accountId, env, symbol: symbol.oanda, units: Number(orderUnits), direction: orderSide === "buy" ? "BUY" : "SELL", stopLoss: orderSl || undefined, takeProfit: orderTp || undefined });
      if (!data.success) throw new Error(data.message);
      toast.success("Order placed!");
      loadAccount();
    } catch (e) { toast.error(e.message); }
    finally { setOrdering(false); }
  }, [env, liveOrderConfirm, apiKey, accountId, symbol, orderSide, orderUnits, orderSl, orderTp, post, loadAccount]);

  const closePosition = useCallback(async (tradeId) => {
    if (env === "live" && closeConfirmId !== tradeId) { setCloseConfirmId(tradeId); return; }
    setCloseConfirmId(null);
    try {
      const data = await post("close", { apiKey, accountId, env, tradeId });
      if (!data.success) throw new Error(data.message);
      toast.success("Position closed");
      loadAccount();
    } catch (e) { toast.error(e.message); }
  }, [env, closeConfirmId, apiKey, accountId, post, loadAccount]);

  const pip    = symbol.oanda === "XAU_USD" ? 0.01 : symbol.oanda.includes("JPY") ? 0.01 : 0.0001;
  const bid    = pricing ? parseFloat(pricing.bids?.[0]?.price || 0) : 0;
  const ask    = pricing ? parseFloat(pricing.asks?.[0]?.price || 0) : 0;
  const spread = pricing ? ((ask - bid) / pip).toFixed(1) : null;
  const prec   = symbol.oanda === "XAU_USD" ? 2 : symbol.oanda.includes("JPY") ? 3 : 5;
  const accountOpts = accounts.map((a) => ({ value: a.id, name: a.name || a.id }));

  return (
    <div className={styles.tabContent}>
      <div className={styles.capitalShell}>

        <div className={styles.capitalTopSection}>
          <div className={styles.capitalChartCol}>
            <div className={styles.tvTerminal}>
              <TradingViewChart symbol={symbol.tv} />
            </div>
            {connected && pricing && (
              <div className={styles.livePriceTicker}>
                <LiveIcon className={styles.liveIcon} />
                <span className={styles.tickerPair}>{symbol.label}</span>
                <span className={styles.tickerBid}>Bid <strong>{bid.toFixed(prec)}</strong></span>
                <span className={styles.tickerAsk}>Ask <strong>{ask.toFixed(prec)}</strong></span>
                {spread && <span className={styles.tickerSpread}>Spread <strong>{spread}</strong></span>}
                <span className={styles.tickerStatus} data-tradeable={pricing.tradeable ? "true" : "false"}>
                  {pricing.tradeable ? "● Market Open" : "● Market Closed"}
                </span>
              </div>
            )}
          </div>
          <div className={styles.capitalControlCol}>
            <div className={styles.capitalConnect}>
                <div className={styles.capitalConnectHead}>
                <div className={styles.connectIcon}><WalletIcon /></div>
                <div>
                  <h2>Connect OANDA</h2>
                  <p>Works in the US, Canada, Japan, Australia & more. Link practice or live.</p>
                </div>
              </div>
              <div className={styles.capitalForm}>
                <div className={styles.settingGroup}>
                  <label>Environment</label>
                  <Dropdown
                    options={ENV_OPTS}
                    value={ENV_OPTS.find((o) => o.value === env) || null}
                    onSelect={(opt) => { setEnv(opt.value); setConnected(false); setAccount(null); setAccounts([]); setPricing(null); }}
                    dropPlaceHolder="Select environment"
                  />
                </div>
                <div className={styles.settingGroup}>
                  <label>API Key</label>
                  <div className={authStyles.authInput}>
                    <KeyIcon className={authStyles.authIcon} />
                    <input type="password" placeholder="Your OANDA API key" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setConnected(false); }} />
                  </div>
                </div>
                {accounts.length > 1 && (
                  <div className={styles.settingGroup}>
                    <label>Account</label>
                    <Dropdown
                      options={accountOpts}
                      value={accountOpts.find((o) => o.value === accountId) || null}
                      onSelect={(opt) => setAccountId(opt.value)}
                      dropPlaceHolder="Select account"
                    />
                  </div>
                )}
                {accounts.length === 0 ? (
                  <button className={styles.runBtn} onClick={connect} disabled={connecting}>
                    <LinkIcon /><span>{connecting ? "Connecting..." : "Connect Account"}</span>
                  </button>
                ) : (
                  <button className={styles.runBtn} onClick={() => loadAccount()} disabled={connecting || !accountId}>
                    <CheckIcon /><span>{connecting ? "Loading..." : "Load Account"}</span>
                  </button>
                )}
                {connError && <div className={styles.capitalError}><WarnIcon /><span>{connError}</span></div>}
              </div>
              <div className={styles.capitalApiNote}>
                <p>Get your API key: log in at <strong>oanda.com</strong> → <strong>My Account &rarr; Manage API Access</strong>. Use Practice environment for testing.</p>
              </div>
              <div className={styles.trustNote}>
                <CheckIconSolid /><span>Your API key is sent directly to OANDA and never stored on our servers</span>
              </div>
            </div>

            {connected && account && (
              <div className={styles.capitalAccountBox}>
                <div className={styles.capitalAccountGrid}>
                  {[
                    { label: "Balance",        val: `${account.currency} ${account.balance.toFixed(2)}` },
                    { label: "NAV",            val: `${account.currency} ${account.nav.toFixed(2)}` },
                    { label: "Unrealized P&L", val: `${account.unrealizedPL >= 0 ? "+" : ""}${account.unrealizedPL.toFixed(2)}`, pos: account.unrealizedPL >= 0 ? "true" : "false" },
                    { label: "Open Trades",    val: account.openTradeCount },
                    { label: "Margin Used",    val: `${account.currency} ${account.marginUsed.toFixed(2)}` },
                    { label: "Margin Free",    val: `${account.currency} ${account.marginAvailable.toFixed(2)}` },
                  ].map(({ label, val, pos }) => (
                    <div key={label} className={styles.capitalStat}>
                      <div className={styles.statVal} data-positive={pos}>{val}</div>
                      <div className={styles.statLbl}>{label}</div>
                    </div>
                  ))}
                </div>
                <div className={styles.capitalSectionTitle}>
                  Quick Order
                  <span className={styles.envBadge} data-env={env}>{env === "live" ? "Live Account" : "Demo Account"}</span>
                </div>
                {env === "live" && (
                  <div className={styles.liveWarningBanner}>
                    You are connected to a LIVE account. Orders placed here will execute real trades with real money.
                  </div>
                )}
                <div className={styles.settingGroup}>
                  <label>Symbol</label>
                  <Dropdown options={SYMBOL_OPTS} value={SYMBOL_OPTS.find((o) => o.value === symbol.label) || null} onSelect={(opt) => setSymbol(SYMBOLS.find((s) => s.label === opt.value))} dropPlaceHolder="Select symbol" />
                </div>
                <div className={styles.orderForm}>
                  <div className={styles.orderSideRow}>
                    <button className={styles.orderSideBtn} data-active={orderSide === "buy" ? "true" : "false"} data-side="buy" onClick={() => setOrderSide("buy")}><BuyIcon /> Buy</button>
                    <button className={styles.orderSideBtn} data-active={orderSide === "sell" ? "true" : "false"} data-side="sell" onClick={() => setOrderSide("sell")}><SellIcon /> Sell</button>
                  </div>
                  <div className={styles.settingGroup}>
                    <label>Units</label>
                    <div className={authStyles.authInput}>
                      <TradeIcon className={authStyles.authIcon} />
                      <input type="number" min={100} max={1000000} value={orderUnits} onChange={(e) => setOrderUnits(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.settingGroup}>
                    <label>Stop Loss Price (optional)</label>
                    <div className={authStyles.authInput}>
                      <WarnIcon className={authStyles.authIcon} />
                      <input type="number" step="0.00001" placeholder="e.g. 1.08000" value={orderSl} onChange={(e) => setOrderSl(e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.settingGroup}>
                    <label>Take Profit Price (optional)</label>
                    <div className={authStyles.authInput}>
                      <CheckIcon className={authStyles.authIcon} />
                      <input type="number" step="0.00001" placeholder="e.g. 1.10000" value={orderTp} onChange={(e) => setOrderTp(e.target.value)} />
                    </div>
                  </div>
                  {liveOrderConfirm ? (
                    <div className={styles.liveOrderConfirm}>
                      <p className={styles.liveOrderConfirmText}>
                        Confirm: place a real {orderSide.toUpperCase()} order for {Number(orderUnits).toLocaleString()} {symbol.label} on your live OANDA account?
                      </p>
                      <div className={styles.liveOrderConfirmBtns}>
                        <button className={styles.liveOrderConfirmYes} onClick={placeOrder} disabled={ordering}>
                          {ordering ? "Placing..." : "Yes, Place Order"}
                        </button>
                        <button className={styles.liveOrderConfirmNo} onClick={() => setLiveOrderConfirm(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className={styles.runBtn} onClick={placeOrder} disabled={ordering}>
                      {ordering ? "Placing..." : `${orderSide === "buy" ? "Buy" : "Sell"} ${Number(orderUnits).toLocaleString()} ${symbol.label}`}
                    </button>
                  )}
                </div>
                {positions.length > 0 && (
                  <div className={styles.positionsBox}>
                    <div className={styles.capitalSectionTitle}>
                      Open Positions
                      <button className={styles.refreshBtn} onClick={() => loadAccount()}><RefreshIcon /></button>
                    </div>
                    {positions.map((p) => (
                      <div key={p.id} className={styles.positionRow}>
                        <div className={styles.posInstrument}>{p.instrument.replace("_", "/")}</div>
                        <div data-positive={p.units > 0 ? "true" : "false"}>{p.units > 0 ? "+" : ""}{p.units}</div>
                        <div>{p.openPrice}</div>
                        <div data-positive={p.unrealizedPL >= 0 ? "true" : "false"}>{p.unrealizedPL >= 0 ? "+" : ""}{p.unrealizedPL.toFixed(2)}</div>
                        {closeConfirmId === p.id ? (
                          <div className={styles.posConfirmRow}>
                            <button className={styles.posConfirmYes} onClick={() => closePosition(p.id)}>Close</button>
                            <button className={styles.posConfirmNo} onClick={() => setCloseConfirmId(null)}>No</button>
                          </div>
                        ) : (
                          <button className={styles.closePosBtn} onClick={() => closePosition(p.id)}><CloseIcon /></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {oandaAd && (
              <div className={styles.capitalAdSlot}>
                <AdCard ad={oandaAd} variant="terminal" />
              </div>
            )}
          </div>
        </div>{/* end capitalTopSection */}

        {/* OANDA backtest below, natural scroll */}
        {connected && (
          <div className={styles.capitalBtSection}>
            <div className={styles.capitalSectionTitle}>Backtest with Real OANDA Data</div>
            <div className={styles.backtestShell}>
              <div className={styles.backtestSettingsPanel}>
                <div className={styles.settingGroup}>
                  <label>Symbol</label>
                  <Dropdown options={SYMBOL_OPTS} value={SYMBOL_OPTS.find((o) => o.value === symbol.label) || null} onSelect={(opt) => setSymbol(SYMBOLS.find((s) => s.label === opt.value))} dropPlaceHolder="Select symbol" />
                </div>
                <div className={styles.settingGroup}>
                  <label>Period</label>
                  <Dropdown options={PERIOD_OPTS} value={PERIOD_OPTS.find((o) => o.value === period.label) || null} onSelect={(opt) => setPeriod(PERIODS.find((p) => p.label === opt.value))} dropPlaceHolder="Select period" />
                </div>
                <div className={styles.settingGroup}>
                  <label>Strategy</label>
                  <Dropdown options={STRATEGY_OPTS} value={STRATEGY_OPTS.find((o) => o.value === strategy) || null} onSelect={(opt) => setStrategy(opt.value)} dropPlaceHolder="Select strategy" />
                </div>
                <div className={styles.settingGroup}>
                  <label>SL (pips)</label>
                  <div className={authStyles.authInput}><WarnIcon className={authStyles.authIcon} /><input type="number" min={5} value={sl} onChange={(e) => setSl(e.target.value)} /></div>
                </div>
                <div className={styles.settingGroup}>
                  <label>TP (pips)</label>
                  <div className={authStyles.authInput}><CheckIcon className={authStyles.authIcon} /><input type="number" min={5} value={tp} onChange={(e) => setTp(e.target.value)} /></div>
                </div>
                <button className={styles.runBtn} onClick={runOandaBt} disabled={btLoading}>
                  <RunIcon /><span>{btLoading ? "Running..." : "Run Backtest"}</span>
                </button>
              </div>
              <div className={styles.backtestResultsShell}>
                {(!btResult || btLoading || btError) ? (
                  <div className={styles.backtestEmptyZone}>
                    {btLoading && <><div className={styles.spinner} /><p>Fetching OANDA candles...</p></>}
                    {btError  && <div className={styles.errorBox}><WarnIcon /><p>{btError}</p></div>}
                    {!btLoading && !btError && <><ChartIcon /><p>Run a backtest with your real OANDA candle data.</p></>}
                  </div>
                ) : (
                  <>
                    <div className={styles.backtestStatsWrap}><StatsRow stats={btResult.stats} /></div>
                    <div className={styles.backtestChartZone}><BacktestCharts result={btResult} idSuffix="_oanda" /></div>
                    <div className={styles.backtestTradeZone}><TradeTable trades={btResult.trades} /></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>{/* end capitalShell */}
    </div>
  );
}

function MT4Tab() {
  const { ads, loaded, fetchAds } = useAdvertStore();
  useEffect(() => { if (!loaded) fetchAds(); }, [loaded, fetchAds]);
  const brokers = ads.filter((a) => a.isActive && a.affiliateLink);

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabScrollShell}>
      <div className={styles.connectMain}>
        {brokers.length > 0 && (
          <div className={styles.connectSection}>
            <div className={styles.connectSectionHead}>
              <div className={styles.connectIcon}><WalletIcon /></div>
              <div>
                <h2>Affiliate Broker Partners</h2>
                <p>Open a demo or live MT4/MT5 account with our vetted partners.</p>
              </div>
            </div>
            <div className={styles.brokerGrid}>
              {brokers.map((ad) => <AdCard key={ad._id} ad={ad} variant="partner" />)}
            </div>
          </div>
        )}
        <div className={styles.connectSection}>
          <div className={styles.connectSectionHead}>
            <div className={styles.connectIcon}><CodeIcon /></div>
            <div>
              <h2>Deploy Your EA in MetaTrader</h2>
              <p>Step-by-step guide to running your generated Expert Advisor in MT4 or MT5.</p>
            </div>
          </div>
          <div className={styles.deploySteps}>
            {[
              { title: "Build Your Bot",     desc: "Go to Build Your Bot, choose MT4, MT5, or Both, configure your strategy, and complete checkout." },
              { title: "Open Demo Account",  desc: "Click a partner broker above and open a free MetaTrader demo account. No real money required." },
              { title: "Install MetaTrader", desc: "Download MT4 or MT5 from your broker. Open File → Open Data Folder → MQL4/Experts (or MQL5/Experts for MT5)." },
              { title: "Add Your Bot",       desc: "From your My Bots tab, copy your .mq4/.mq5 source. Save it in Experts, press F4 in the editor, and click Compile." },
              { title: "Attach & Trade",     desc: "Drag your EA from Navigator onto a chart. Enable AutoTrading and confirm input settings." },
              { title: "Strategy Tester",    desc: "Use View → Strategy Tester in MT4/MT5 to backtest on your broker's own historical data before going live." },
            ].map(({ title, desc }, i) => (
              <div key={i} className={styles.deployStep}>
                <div className={styles.deployStepNum}>{i + 1}</div>
                <div className={styles.deployStepBody}><h4>{title}</h4><p>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.disclaimer}>
          <p>Trading involves significant risk of loss. Past performance does not guarantee future results. ForexInstincts does not provide financial advice. Always test with a demo account first.</p>
          <div className={styles.disclaimerLinks}>
            <Link href="/terms">Terms of Use</Link><span>·</span><Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      </div>{/* end tabScrollShell */}
    </div>
  );
}

const TABS = [
  { id: "bots",        label: "My Bots",           desc: "Manage & deploy",        mobileLabel: "Bots",     icon: <BotsTabIcon /> },
  { id: "backtest",    label: "Strategy Backtest",  desc: "Real OHLCV data",        mobileLabel: "Backtest", icon: <ChartIcon   /> },
  { id: "tradingview", label: "TradingView",         desc: "Charts & Pine Script",   mobileLabel: "Charts",   icon: <CodeIcon    /> },
  { id: "capital",      label: "Capital.com",          desc: "Live account & trading", mobileLabel: "Capital",  icon: <LiveIcon    /> },
  { id: "oanda",        label: "OANDA",                desc: "US, Canada & global",    mobileLabel: "OANDA",    icon: <TradeIcon   /> },
  { id: "mt4mt5",      label: "MT4 / MT5",           desc: "Expert Advisor deploy",  mobileLabel: "MT4/MT5",  icon: <RocketIcon  /> },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { isAuth, username, isInitialized, initializeAuth } = useAuthStore();
  const { ads, loaded, fetchAds } = useAdvertStore();

  const initTab  = TABS.find((t) => t.id === searchParams.get("tab"))?.id || "bots";
  const [activeTab, setActiveTab] = useState(initTab);

  useEffect(() => { initializeAuth(); }, [initializeAuth]);
  useEffect(() => { if (!loaded) fetchAds(); }, [loaded, fetchAds]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuth) router.push("/authentication/login");
  }, [isAuth, isInitialized, router]);

  if (!isInitialized) return <div className={styles.pageFallback}><div className={styles.spinner} /></div>;
  if (!isAuth) return null;

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={styles.sidebarItem}
              data-active={activeTab === t.id ? "true" : "false"}
              onClick={() => setActiveTab(t.id)}
            >
              <div className={styles.sidebarItemIcon}>{t.icon}</div>
              <div className={styles.sidebarItemBody}>
                <span className={styles.sidebarItemLabel}>{t.label}</span>
                <span className={styles.sidebarItemDesc}>{t.desc}</span>
              </div>
            </button>
          ))}
        </nav>

        {ads.filter((a) => a.isActive && a.affiliateLink && a.showTerminal).slice(0, 1).map((ad) => (
          <div key={ad._id} className={styles.sidebarAdSlot}>
            <AdCard ad={ad} variant="terminal" />
          </div>
        ))}

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarUserAvatar}>{username?.[0]?.toUpperCase() || "U"}</div>
            <div className={styles.sidebarUserInfo}>
              <span className={styles.sidebarUserName}>{username}</span>
              <Link href="/tiers" className={styles.sidebarUserLink}>Build New Bot →</Link>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.terminalMain}>
        {activeTab === "bots"        && <BotsTab />}
        {activeTab === "backtest"    && <BacktestTab />}
        {activeTab === "tradingview" && <TVTab />}
        {activeTab === "capital"      && <CapitalTab />}
        {activeTab === "oanda"        && <OandaTab />}
        {activeTab === "mt4mt5"      && <MT4Tab />}
      </main>

      <nav className={styles.mobileNav}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={styles.mobileNavItem}
            data-active={activeTab === t.id ? "true" : "false"}
            onClick={() => setActiveTab(t.id)}
          >
            <div className={styles.mobileNavIcon}>{t.icon}</div>
            <span className={styles.mobileNavLabel}>{t.mobileLabel}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className={styles.pageFallback}><div className={styles.spinner} /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
