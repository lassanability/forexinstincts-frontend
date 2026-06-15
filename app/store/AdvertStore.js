import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAdvertStore = create((set) => ({
  ads: [],
  loaded: false,
  loading: false,

  fetchAds: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${SERVER_API}/adverts`);
      const data = await res.json();
      if (data.success) set({ ads: data.data, loaded: true });
    } catch {
    } finally {
      set({ loading: false });
    }
  },

  getByPlacement: (placement) => {
    const ads = useAdvertStore.getState().ads;
    return ads.filter((a) => a.isActive && a.affiliateLink && a[placement]);
  },

  getPartnerAds: () => {
    return useAdvertStore.getState().ads.filter((a) => a.isActive && a.affiliateLink);
  },
}));
