"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/AuthStore";
import styles from "@/app/style/auth.module.css";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { MdOutlineEmail as EmailIcon, MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={onSubmit}
        className={styles.formContainer}
        autoComplete="on"
      >
        <div className={styles.formHeader}>
          <h1>Welcome back</h1>
          <p>Sign in to your ForexInstincts account</p>
        </div>

        <div className={styles.authInput}>
          <EmailIcon className={styles.authIcon} width={20} height={20} />
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} width={20} height={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => setShowPassword((p) => !p)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <ShowPasswordIcon className={styles.authIcon} width={20} height={20} />
            ) : (
              <HidePasswordIcon className={styles.authIcon} width={20} height={20} />
            )}
          </button>
        </div>

        <div className={styles.forgotpasswordspan}>
          <span onClick={() => router.push("/authentication/resetcode")}>
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Login"}
        </button>

        <h3>
          Don&apos;t have an account?{" "}
          <div
            className={styles.btnLoginContainer}
            onClick={() => router.push("signup")}
          >
            Sign up
          </div>
        </h3>
      </form>
    </div>
  );
}
