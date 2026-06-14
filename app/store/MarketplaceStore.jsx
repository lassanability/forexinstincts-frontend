import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useMarketplaceStore = create((set) => ({
  bots: [],
  loading: false,

  fetchBots: async () => {
    try {
      set({ loading: true });
      const [prebuiltRes, userBotsRes] = await Promise.all([
        fetch(`${SERVER_API}/prebuilt-bots`),
        fetch(`${SERVER_API}/orders/public`),
      ]);
      const [prebuiltData, userBotsData] = await Promise.all([
        prebuiltRes.json(),
        userBotsRes.json(),
      ]);

      const prebuilt = prebuiltData.success ? prebuiltData.data : [];
      const userBots = userBotsData.success ? userBotsData.data : [];

      const combined = [
        ...prebuilt.map(b => ({ ...b, isUserBot: false })),
        ...userBots.map(b => ({ ...b, isUserBot: true })),
      ];

      set({ bots: combined, loading: false });
      return { success: true, data: combined };
    } catch {
      set({ loading: false });
      return { success: false, message: "Failed to fetch bots" };
    }
  },
}));
