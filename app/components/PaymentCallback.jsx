"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/app/store/SubscriptionStore";
import { toast } from "sonner";
import { 
  IoCheckmarkCircle as SuccessIcon,
  IoCloseCircle as ErrorIcon,
  IoHourglass as LoadingIcon 
} from "react-icons/io5";

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPayment, verifyingPayment } = useSubscriptionStore();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const reference = searchParams.get('reference');
    const paymentStatus = searchParams.get('status');

    if (!reference) {
      toast.error("Invalid payment reference");
      router.push('/tiers');
      return;
    }

    if (paymentStatus === 'cancelled') {
      toast.error("Payment was cancelled");
      router.push('/tiers');
      return;
    }

    handleVerification(reference);
  }, []);

  const handleVerification = async (reference) => {
    try {
      const result = await verifyPayment(reference);

      if (result.success) {
        setStatus("success");
        toast.success(result.message || "Payment successful! 🎉", {
          duration: 5000
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setStatus("error");
        toast.error(result.message || "Payment verification failed");

        setTimeout(() => {
          router.push('/tiers');
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      console.error("Verification error:", error);
      toast.error("Failed to verify payment");
      
      setTimeout(() => {
        router.push('/tiers');
      }, 3000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "verifying" && (
          <>
            <LoadingIcon style={styles.iconVerifying} />
            <h1 style={styles.title}>Verifying Payment...</h1>
            <p style={styles.message}>
              Please wait while we confirm your payment
            </p>
            <div style={styles.loader}></div>
          </>
        )}

        {status === "success" && (
          <>
            <SuccessIcon style={styles.iconSuccess} />
            <h1 style={styles.title}>Payment Successful!</h1>
            <p style={styles.message}>
              Welcome to your new tier! Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <ErrorIcon style={styles.iconError} />
            <h1 style={styles.title}>Payment Verification Failed</h1>
            <p style={styles.message}>
              We couldn't verify your payment. Redirecting back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "24px",
    padding: "48px",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)",
  },
  iconVerifying: {
    fontSize: "72px",
    color: "#a855f7",
    marginBottom: "24px",
    animation: "spin 2s linear infinite",
  },
  iconSuccess: {
    fontSize: "72px",
    color: "#22c55e",
    marginBottom: "24px",
  },
  iconError: {
    fontSize: "72px",
    color: "#ef4444",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  message: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.6",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(168, 85, 247, 0.2)",
    borderTop: "4px solid #a855f7",
    borderRadius: "50%",
    margin: "24px auto 0",
    animation: "spin 1s linear infinite",
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}