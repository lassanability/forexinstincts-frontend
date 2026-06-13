import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      token: "",
      profileImage: "",
      hasUsedTrial: false,
      isInitialized: false,

      setUser: (userData, token) => {
        set({
          isAuth: true,
          userId: userData.id,
          username: userData.name,
          email: userData.email,
          token,
          profileImage: userData.profileImage || "",
          hasUsedTrial: userData.hasUsedTrial || false,
          isInitialized: true,
        });
      },

      clearUser: () => {
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          token: "",
          profileImage: "",
          hasUsedTrial: false,
          isInitialized: false,
        });
      },

      setHasUsedTrial: () => set({ hasUsedTrial: true }),

      fetchProfile: async () => {
        try {
          const { token } = get();
          if (!token) return;
          const response = await fetch(`${SERVER_API}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success && data.user) {
            set({ hasUsedTrial: data.user.hasUsedTrial || false });
          }
        } catch {}
      },

      register: async (name, email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await response.json();
          if (data.success) {
            set({ email });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || "Registration failed" };
        } catch {
          return { success: false, message: "Connection failed. Please try again." };
        }
      },

      verifyEmail: async (email, verificationCode) => {
        try {
          const response = await fetch(`${SERVER_API}/user/verify-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, verificationCode }),
          });
          const data = await response.json();
          if (data.success) {
            get().setUser(data.user, data.token);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || "Verification failed" };
        } catch {
          return { success: false, message: "Connection failed. Please try again." };
        }
      },

      resendVerificationCode: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/user/resend-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          return { success: data.success, message: data.message };
        } catch {
          return { success: false, message: "Connection failed. Please try again." };
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.success) {
            get().setUser(data.user, data.token);
            return { success: true, message: data.message };
          }
          if (data.requiresVerification) {
            set({ email });
          }
          return { success: false, message: data.message || "Invalid credentials", requiresVerification: data.requiresVerification };
        } catch {
          return { success: false, message: "Connection failed. Please try again." };
        }
      },

      logout: async () => {
        get().clearUser();
        if (typeof window !== "undefined") {
          localStorage.removeItem("forexinstincts-auth");
        }
        return { success: true, message: "Logged out successfully" };
      },

      uploadProfilePicture: async (file) => {
        try {
          const { token } = get();
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          const response = await fetch(`${SERVER_API}/user/profile-picture`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ image: base64 }),
          });
          const data = await response.json();
          if (data.success) {
            set({ profileImage: data.url });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || "Upload failed" };
        } catch {
          return { success: false, message: "Upload failed. Please try again." };
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          const { token } = get();
          const response = await fetch(`${SERVER_API}/user/change-password`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
          });
          const data = await response.json();
          if (data.success) {
            set({ token: data.token });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch {
          return { success: false, message: "Password change failed" };
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/user/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          return { success: data.success, message: data.message };
        } catch {
          return { success: false, message: 'Connection failed. Please try again.' };
        }
      },

      resetPassword: async (token, password) => {
        try {
          const response = await fetch(`${SERVER_API}/user/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
          });
          const data = await response.json();
          return { success: data.success, message: data.message };
        } catch {
          return { success: false, message: 'Connection failed. Please try again.' };
        }
      },

      getAuthHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      initializeAuth: () => {
        set({ isInitialized: true });
      },
    }),
    {
      name: "forexinstincts-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuth: state.isAuth,
        userId: state.userId,
        username: state.username,
        email: state.email,
        token: state.token,
        profileImage: state.profileImage,
        hasUsedTrial: state.hasUsedTrial,
      }),
    }
  )
);
