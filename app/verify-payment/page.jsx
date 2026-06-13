"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useOrderStore } from "@/app/store/OrderStore";
import styles from "@/app/style/verifyPayment.module.css";
import {
  IoCheckmark as CheckIcon,
  IoClose as CloseIcon,
} from "react-icons/io5";

function VerifyContent() {
  const searchParams = useSearchParams();
  const { verifyPayment } = useOrderStore();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found. Please contact support.");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyPayment(reference);
        if (result.success) {
          setStatus("success");
          setMessage("Payment confirmed! Your bot is being generated. Check your dashboard to download it when ready. Crypto confirmations may take a few minutes.");
        } else {
          setStatus("error");
          setMessage(result.message || "Payment verification failed. Please contact support.");
        }
      } catch {
        setStatus("error");
        setMessage("Unable to verify payment. Please contact support@forexinstincts.com");
      }
    };

    verify();
  }, [searchParams, verifyPayment]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === "verifying" && (
          <>
            <div className={styles.spinner} />
            <h2>Verifying Payment</h2>
            <p>Please wait while we confirm your payment...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.successIcon}>
              <CheckIcon />
            </div>
            <h2>Payment Confirmed!</h2>
            <p>{message}</p>
            <Link href="/dashboard" className={styles.btn}>
              Go to Dashboard
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.errorIcon}>
              <CloseIcon />
            </div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <Link href="/dashboard" className={styles.btn}>
              Back to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <div className={styles.card}>
            <div className={styles.spinner} />
            <h2>Loading...</h2>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
