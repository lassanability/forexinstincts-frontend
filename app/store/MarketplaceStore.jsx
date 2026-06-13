import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useMarketplaceStore = create((set) => ({
  bots: [],
  loading: false,

  fetchBots: async () => {
    try {
      set({ loading: true });
      const response = await fetch(`${SERVER_API}/prebuilt-bots`);
      const data = await response.json();
      if (data.success) {
        set({ bots: data.data, loading: false });
        return { success: true, data: data.data };
      }
      set({ loading: false });
      return { success: false, message: data.message };
    } catch {
      set({ loading: false });
      return { success: false, message: "Failed to fetch bots" };
    }
  },
}));
