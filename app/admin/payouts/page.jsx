"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import styles from "@/app/style/adminPayouts.module.css";
import {
  IoLogOutOutline as LogoutIcon,
  IoRefreshOutline as RefreshIcon,
  IoCheckmarkCircle as CheckIcon,
  IoTimeOutline as ClockIcon,
  IoSyncOutline as SyncIcon,
  IoCloseCircle as RejectIcon,
} from "react-icons/io5";
import { MdOutlineEmail as EmailIcon, MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_KEY = "fi-admin-token";

const STATUS_OPTIONS = ["pending", "processing", "completed", "rejected"];

const STATUS_ICONS = {
  pending: ClockIcon,
  processing: SyncIcon,
  completed: CheckIcon,
  rejected: RejectIcon,
};

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token, data.admin);
        toast.success(`Welcome, ${data.admin.name}`);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.loginHeader}>
          <h1>Admin Access</h1>
          <p>Payout Management</p>
        </div>
        <div className={styles.loginField}>
          <EmailIcon className={styles.loginFieldIcon} />
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div className={styles.loginField}>
          <PasswordIcon className={styles.loginFieldIcon} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className={styles.loginBtn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function PayoutRow({ payout, token, onUpdated }) {
  const [status, setStatus] = useState(payout.status);
  const [proofNote, setProofNote] = useState(payout.proofNote || "");
  const [adminNote, setAdminNote] = useState(payout.adminNote || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${SERVER_API}/payouts/admin/${payout._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, proofNote, adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payout updated");
        onUpdated(data.data);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const StatusIcon = STATUS_ICONS[status] || ClockIcon;

  return (
    <div className={styles.payoutRow}>
      <div className={styles.rowTop}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{payout.userId?.name || "Unknown"}</span>
          <span className={styles.userEmail}>{payout.userId?.email || "—"}</span>
        </div>
        <div className={styles.rowAmount}>${(payout.amount || 0).toFixed(2)}</div>
        <div className={styles.rowDate}>
          {new Date(payout.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <span className={styles.rowStatus} data-status={payout.status}>
          <StatusIcon />
          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
        </span>
      </div>

      <div className={styles.rowWallet}>
        <span className={styles.rowWalletLabel}>Wallet:</span>
        <span className={styles.rowWalletAddr}>{payout.walletAddress}</span>
      </div>

      <div className={styles.rowControls}>
        <div className={styles.rowField}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.statusSelect}
            data-status={status}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.rowField}>
          <label>Proof / Receipt</label>
          <input
            type="text"
            className={styles.proofInput}
            placeholder="Transaction ID or receipt info"
            value={proofNote}
            onChange={(e) => setProofNote(e.target.value)}
          />
        </div>
        <div className={styles.rowField}>
          <label>Admin Note</label>
          <input
            type="text"
            className={styles.proofInput}
            placeholder="Internal note (not shown to user)"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPayoutsPage() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const fetchPayouts = useCallback(async (tok, status, pg) => {
    if (!tok) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 20 });
      if (status) params.set("status", status);
      const res = await fetch(`${SERVER_API}/payouts/admin?${params}`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(data.data);
        setPagination(data.pagination);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(data.message || "Failed to load payouts");
      }
    } catch {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchPayouts(token, statusFilter, page);
  }, [token, statusFilter, page, fetchPayouts]);

  const handleLogin = (tok, adminData) => {
    setToken(tok);
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
    setPayouts([]);
  };

  const handleUpdated = (updated) => {
    setPayouts((prev) =>
      prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p))
    );
  };

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className={styles.adminWrapper}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Payout Management</h1>
          <p>Review and process user withdrawal requests</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchPayouts(token, statusFilter, page)}
            disabled={loading}
          >
            <RefreshIcon />
            <span>Refresh</span>
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Filter by status:</span>
        {["", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s || "all"}
            className={styles.filterBtn}
            data-active={statusFilter === s ? "true" : undefined}
            onClick={() => handleFilterChange(s)}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <SyncIcon className={styles.loadingIcon} />
          <p>Loading payouts...</p>
        </div>
      ) : payouts.length === 0 ? (
        <div className={styles.emptyState}>
          <CheckIcon className={styles.emptyIcon} />
          <p>No payout requests found{statusFilter ? ` for status "${statusFilter}"` : ""}.</p>
        </div>
      ) : (
        <div className={styles.payoutList}>
          {payouts.map((p) => (
            <PayoutRow key={p._id} payout={p} token={token} onUpdated={handleUpdated} />
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className={styles.paginationRow}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.pages} &nbsp;·&nbsp; {pagination.total} total
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((prev) => Math.min(pagination.pages, prev + 1))}
            disabled={page >= pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
