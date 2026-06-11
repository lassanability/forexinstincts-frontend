"use client";

import { toast } from "sonner";
import { useState, Suspense } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/AuthStore";
import { getEmailValidationError } from "@/app/lib/emailValidation";
import styles from "@/app/style/auth.module.css";
import { useRouter } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";

function SignUpForm() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [terms, setTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const { register } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((p) => !p);
    } else {
      setShowConfirmPassword((p) => !p);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    const emailError = await getEmailValidationError(formData.email.trim());
    if (emailError) {
      toast.error(emailError);
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!terms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      if (result.success) {
        toast.success(result.message || "Verification code sent to your email!");
        router.push("/authentication/verification");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <form
        onSubmit={handleSubmit}
        className={styles.formContainer}
        autoComplete="on"
      >
        <div className={styles.formHeader}>
          <h1>Join ForexInstincts</h1>
          <p>Create your account and start building trading bots</p>
        </div>

        <div className={styles.authInput}>
          <UserNameIcon className={styles.authIcon} width={24} height={24} />
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            autoComplete="name"
            required
          />
        </div>

        <div className={styles.authInput}>
          <EmailIcon className={styles.authIcon} width={24} height={24} />
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
          <PasswordIcon className={styles.authIcon} width={24} height={24} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => togglePasswordVisibility("password")}
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <ShowPasswordIcon className={styles.authIcon} width={24} height={24} />
            ) : (
              <HidePasswordIcon className={styles.authIcon} width={24} height={24} />
            )}
          </button>
        </div>

        <div className={styles.authInput}>
          <PasswordIcon className={styles.authIcon} width={24} height={24} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => togglePasswordVisibility("confirmPassword")}
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? (
              <ShowPasswordIcon className={styles.authIcon} width={24} height={24} />
            ) : (
              <HidePasswordIcon className={styles.authIcon} width={24} height={24} />
            )}
          </button>
        </div>

        <div className={styles.termsContainer}>
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            required
          />
          <label htmlFor="terms">
            I accept the{" "}
            <Link href="/terms">Terms of Use</Link>
            {" "}and{" "}
            <Link href="/privacy">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.formAuthButton}
        >
          {isLoading ? <Loader /> : "Create Account"}
        </button>

        <h3>
          Already have an account?{" "}
          <div
            className={styles.btnLoginContainer}
            onClick={() => router.push("login")}
          >
            Login
          </div>
        </h3>
      </form>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<Loader />}>
      <SignUpForm />
    </Suspense>
  );
}
