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
      isInitialized: false,

      setUser: (userData, token) => {
        set({
          isAuth: true,
          userId: userData.id,
          username: userData.name,
          email: userData.email,
          token,
          profileImage: userData.profileImage || "",
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
          isInitialized: false,
        });
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
            get().setUser(data.user, data.token);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message || "Registration failed" };
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
          return { success: false, message: data.message || "Invalid credentials" };
        } catch {
          return { success: false, message: "Connection failed. Please try again." };
        }
      },

      logout: async () => {
        get().clearUser();
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
      }),
    }
  )
);
