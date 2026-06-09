"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/AuthStore";
import styles from "@/app/style/auth.module.css";

import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function ResetCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { requestPasswordReset } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        toast.success(result.message || "Reset link sent to your email!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      toast.error("An error occurred while requesting password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("login", { scroll: false });
  };

  return (
    <div className={styles.authWrapper}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive the reset link</p>
        </div>

        <div className={styles.authInput}>
          <EmailIcon
            className={styles.authIcon}
            alt="Email icon"
            width={20}
            height={20}
          />
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Request reset"}
        </button>

        <h3>
          Remember your password?{" "}
          <div className={styles.btnLoginContainer} onClick={handleLogin}>
            Login
          </div>
        </h3>
      </form>
    </div>
  );
}
