import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useNewsStore = create((set) => ({
  news: [],
  loading: false,

  fetchNews: async () => {
    try {
      set({ loading: true });
      const res = await fetch(`${SERVER_API}/news`);
      const data = await res.json();
      if (data.success) set({ news: data.data });
    } catch {
      /* silent */
    } finally {
      set({ loading: false });
    }
  },
}));
