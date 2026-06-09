import { create } from "zustand";
import { useAuthStore } from "./AuthStore";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useOrderStore = create((set, get) => ({
  tiers: [],
  tiersLoading: false,
  tiersLoaded: false,

  orders: [],
  ordersLoading: false,

  paymentLoading: false,

  fetchTiers: async () => {
    if (get().tiersLoaded) return { success: true, data: get().tiers };
    try {
      set({ tiersLoading: true });
      const response = await fetch(`${SERVER_API}/tiers`);
      const data = await response.json();
      if (data.success) {
        set({ tiers: data.data, tiersLoaded: true, tiersLoading: false });
        return { success: true, data: data.data };
      }
      set({ tiersLoading: false });
      return { success: false, message: data.message };
    } catch {
      set({ tiersLoading: false });
      return { success: false, message: "Failed to fetch tiers" };
    }
  },

  createOrder: async (tierId, botName, config, selectedFeatures = [], durationHours = 10) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const response = await fetch(`${SERVER_API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ tierId, botName, config, selectedFeatures, durationHours }),
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, orderId: data.data.orderId };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: "Failed to create order" };
    }
  },

  initializePayment: async (orderId) => {
    try {
      set({ paymentLoading: true });
      const { getAuthHeader } = useAuthStore.getState();
      const response = await fetch(`${SERVER_API}/payment/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      set({ paymentLoading: false });
      if (data.success) {
        return { success: true, authorizationUrl: data.data.authorizationUrl, reference: data.data.reference };
      }
      return { success: false, message: data.message };
    } catch {
      set({ paymentLoading: false });
      return { success: false, message: "Payment initialization failed" };
    }
  },

  verifyPayment: async (reference) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const response = await fetch(
        `${SERVER_API}/payment/verify?reference=${encodeURIComponent(reference)}`,
        { headers: getAuthHeader() }
      );
      const data = await response.json();
      if (data.success) {
        return { success: true, orderId: data.data?.orderId, status: data.data?.status };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: "Payment verification failed" };
    }
  },

  getMyOrders: async () => {
    try {
      set({ ordersLoading: true });
      const { getAuthHeader } = useAuthStore.getState();
      const response = await fetch(`${SERVER_API}/orders/my`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (data.success) {
        set({ orders: data.data, ordersLoading: false });
        return { success: true, data: data.data };
      }
      set({ ordersLoading: false });
      return { success: false, message: data.message };
    } catch {
      set({ ordersLoading: false });
      return { success: false, message: "Failed to fetch orders" };
    }
  },

  downloadBot: async (orderId, type) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const response = await fetch(
        `${SERVER_API}/orders/my/${orderId}/download?type=${type}`,
        { headers: getAuthHeader() }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { success: false, message: data.message || "Download failed" };
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return { success: true, url };
    } catch {
      return { success: false, message: "Download failed" };
    }
  },
}));
