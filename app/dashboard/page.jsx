"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import { toast } from "sonner";
import styles from "@/app/style/dashboard.module.css";
import BotInstallGuide from "@/app/components/BotInstallGuide";
import BotCard from "@/app/components/BotCard";
import AdCard from "@/app/components/ads/AdCard";
import { useAdvertStore } from "@/app/store/AdvertStore";
import {
  IoRocketOutline as RocketIcon,
  IoCodeSlash as CodeIcon,
  IoStar as StarFilledIcon,
  IoStarOutline as StarEmptyIcon,
  IoChatbubbleEllipsesOutline as TestimonyIcon,
  IoCopyOutline as CopyIcon,
  IoWalletOutline as WalletIcon,
  IoPeopleOutline as PeopleIcon,
  IoTrendingUpOutline as EarningsIcon,
  IoCheckmarkCircle as CheckIcon,
} from "react-icons/io5";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;


export default function Dashboard() {
  const router = useRouter();
  const { isAuth, username, isInitialized, initializeAuth, referralCode, referralCount, referralEarnings, walletAddress, updateWallet, fetchProfile, requestPayout, fetchPayouts } = useAuthStore();
  const { orders: rawOrders, ordersLoading, getMyOrders, downloadBot, deleteOrder, updateVisibility } = useOrderStore();
  const { ads: advertAds, loaded: adsLoaded, fetchAds } = useAdvertStore();
  const bannerAd = advertAds.find((a) => a.isActive && a.affiliateLink && a.showBanner);
  const orders = rawOrders.filter(
    (o) => o.status === "paid" || o.status === "generated" || o.status === "trial" || o.isTrial
  );

  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [walletInput, setWalletInput] = useState("");
  const [walletSaving, setWalletSaving] = useState(false);
  const [walletEditing, setWalletEditing] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [payoutRequesting, setPayoutRequesting] = useState(false);

  const [testimonyText, setTestimonyText] = useState("");
  const [testimonyRating, setTestimonyRating] = useState(5);
  const [testimonySubmitting, setTestimonySubmitting] = useState(false);
  const [testimonyDone, setTestimonyDone] = useState(false);

  const websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://forexinstincts.com";
  const referralLink = referralCode ? `${websiteUrl}/authentication/signup?ref=${referralCode}` : "";

  useEffect(() => { initializeAuth(); }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuth) { router.push("/authentication/login"); return; }
    getMyOrders();
    fetchProfile();
    fetchPayouts().then(r => { if (r.success) setPayouts(r.data); });
  }, [isAuth, isInitialized, router, getMyOrders, fetchProfile, fetchPayouts]);

  useEffect(() => { if (!adsLoaded) fetchAds(); }, [adsLoaded, fetchAds]);

  useEffect(() => { setWalletInput(walletAddress || ""); }, [walletAddress]);

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

  const handleDeleteConfirm = async (orderId) => {
    setDeletingId(orderId);
    setConfirmDeleteId(null);
    const result = await deleteOrder(orderId);
    if (result.success) toast.success("Bot deleted");
    else toast.error(result.message || "Failed to delete bot");
    setDeletingId(null);
  };

  const handleToggleVisibility = async (orderId, isPublic) => {
    const result = await updateVisibility(orderId, isPublic);
    if (result.success) {
      if (isPublic) toast.success("Bot is now public and visible in the marketplace.");
    } else {
      toast.error(result.message || "Failed to update visibility");
    }
  };

  const handleCopyReferral = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.success("Referral link copied!");
    }).catch(() => {
      toast.error("Copy failed — please copy manually");
    });
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
      setPayouts(prev => [result.data, ...prev]);
    } else {
      toast.error(result.message || "Failed to submit payout request");
    }
  };

  const handleTestimonySubmit = async () => {
    if (!testimonyText.trim()) { toast.error("Please write your experience before submitting"); return; }
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

  if (!isInitialized || ordersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <CodeIcon className={styles.loaderIcon} />
          <p>{!isInitialized ? "Initializing..." : "Loading your bots..."}</p>
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
              <p>Welcome back, {username || "Trader"}. Manage and download your generated bots.</p>
            </div>
            <Link href="/tiers" className={styles.buildNewBtn}>
              <RocketIcon />
              <span>Build New Bot</span>
            </Link>
          </div>
        </header>

        <div className={styles.dashboardLayout}>
          {/* LEFT: bots column — visible immediately */}
          <div className={styles.botsColumn}>
            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <CodeIcon className={styles.emptyIcon} />
                <h3>Add your first bot</h3>
                <p>Build your first automated trading bot to get started</p>
                <Link href="/tiers" className={styles.emptyBuildBtn}>
                  <RocketIcon />
                  <span>Get Started</span>
                </Link>
              </div>
            ) : (
              <div className={styles.ordersGrid}>
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

            <div className={styles.testimonySection}>
              <div className={styles.testimonySectionHeader}>
                <div className={styles.testimonyIcon}><TestimonyIcon /></div>
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
                      <div key={star} className={styles.star} onClick={() => setTestimonyRating(star)}>
                        {star <= testimonyRating ? <StarFilledIcon /> : <StarEmptyIcon />}
                      </div>
                    ))}
                  </div>
                  <textarea className={styles.testimonyTextarea} placeholder="Tell us about your experience building bots with ForexInstincts..." value={testimonyText} onChange={(e) => setTestimonyText(e.target.value)} rows={4} />
                  <button className={styles.testimonySubmitBtn} onClick={handleTestimonySubmit} disabled={testimonySubmitting}>
                    {testimonySubmitting ? "Submitting..." : "Submit Testimonial"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: account sidebar */}
          <aside className={styles.accountSidebar}>
            <div className={styles.sidebarStats}>
              <div className={styles.sidebarStatCard}>
                <div className={styles.statIcon}><EarningsIcon /></div>
                <div className={styles.statBody}>
                  <div className={styles.statLabel}>Balance</div>
                  <div className={styles.statValue}>${(referralEarnings || 0).toFixed(2)}</div>
                </div>
              </div>
              <div className={styles.sidebarStatCard}>
                <div className={styles.statIcon}><PeopleIcon /></div>
                <div className={styles.statBody}>
                  <div className={styles.statLabel}>Referrals</div>
                  <div className={styles.statValue}>{referralCount || 0}</div>
                </div>
              </div>
            </div>

            {/* Referral */}
            <div className={styles.sidebarPanel}>
              <div className={styles.sidebarPanelHeader}>
                <div className={styles.sidebarIconWrap}><PeopleIcon /></div>
                <h3>Referral Program</h3>
              </div>
              <div className={styles.referralLinkRow}>
                <div className={styles.referralLinkBox}><span>{referralLink || "Loading..."}</span></div>
                <button className={styles.copyBtn} onClick={handleCopyReferral} disabled={!referralLink}>
                  <CopyIcon />
                </button>
              </div>
              <div className={styles.referralRates}>
                <div className={styles.rateRow}><span>1–4 referrals</span><span>10%</span></div>
                <div className={styles.rateRow}><span>5–9 referrals</span><span>12%</span></div>
                <div className={styles.rateRow}><span>10–19 referrals</span><span>15%</span></div>
                <div className={styles.rateRow}><span>20+ referrals</span><span>20%</span></div>
              </div>
              <p className={styles.referralNote}>50% of sale price when someone buys your marketplace bot.</p>
            </div>

            {/* Wallet */}
            <div className={styles.sidebarPanel}>
              <div className={styles.sidebarPanelHeader}>
                <div className={styles.sidebarIconWrap}><WalletIcon /></div>
                <h3>Payout Wallet</h3>
              </div>
              <div className={styles.walletWarning}>Double-check your wallet address. Incorrect addresses result in permanent loss of funds.</div>
              {walletAddress && !walletEditing ? (
                <div className={styles.walletDisplay}>
                  <span className={styles.walletAddr}>{walletAddress}</span>
                  <button className={styles.editWalletBtn} onClick={() => setWalletEditing(true)}>Change</button>
                </div>
              ) : (
                <div className={styles.walletInputRow}>
                  <input className={styles.walletInput} type="text" placeholder="Enter your crypto wallet address" value={walletInput} onChange={(e) => setWalletInput(e.target.value)} maxLength={120} />
                  <button className={styles.saveWalletBtn} onClick={handleSaveWallet} disabled={walletSaving}>{walletSaving ? "Saving..." : "Save"}</button>
                  {walletEditing && (
                    <button className={styles.cancelWalletBtn} onClick={() => { setWalletEditing(false); setWalletInput(walletAddress || ""); }}>Cancel</button>
                  )}
                </div>
              )}
            </div>

            {/* Payouts */}
            <div className={styles.sidebarPanel}>
              <div className={styles.sidebarPanelHeader}>
                <div className={styles.sidebarIconWrap}><EarningsIcon /></div>
                <h3>Payouts</h3>
              </div>
              <div className={styles.payoutRequestRow}>
                <div className={styles.payoutBalance}>
                  <span className={styles.payoutBalanceLabel}>Available</span>
                  <span className={styles.payoutBalanceAmount}>${(referralEarnings || 0).toFixed(2)}</span>
                </div>
                <button
                  className={styles.payoutRequestBtn}
                  onClick={handleRequestPayout}
                  disabled={payoutRequesting || (referralEarnings || 0) <= 0 || !walletAddress}
                  title={!walletAddress ? "Add a wallet address first" : (referralEarnings || 0) <= 0 ? "No balance to withdraw" : ""}
                >
                  {payoutRequesting ? "Requesting..." : "Request"}
                </button>
              </div>
              {payouts.length > 0 && (
                <div className={styles.payoutHistory}>
                  <h3 className={styles.payoutHistoryTitle}>History</h3>
                  {payouts.map((p) => (
                    <div key={p._id} className={styles.payoutItem}>
                      <div className={styles.payoutItemTop}>
                        <span className={styles.payoutAmount}>${(p.amount || 0).toFixed(2)}</span>
                        <span className={styles.payoutStatus} data-status={p.status}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </div>
                      <div className={styles.payoutItemMeta}>
                        <span className={styles.payoutWallet}>{p.walletAddress}</span>
                        <span className={styles.payoutDate}>{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {p.proofNote && (
                        <div className={styles.payoutProof}>
                          <span className={styles.payoutProofLabel}>Receipt:</span>
                          <span className={styles.payoutProofText}>{p.proofNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {payouts.length === 0 && (
                <p className={styles.payoutEmpty}>No payout requests yet.</p>
              )}
            </div>

            {bannerAd && (
              <div className={styles.sidebarBannerWrap}>
                <AdCard ad={bannerAd} variant="banner" />
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
