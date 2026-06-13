import { create } from "zustand";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBlogStore = create((set, get) => ({
  blogs: [],
  categories: [],
  loading: false,

  fetchBlogs: async () => {
    if (get().loading) return;
    try {
      set({ loading: true });
      const res = await fetch(`${SERVER_API}/blog`);
      const data = await res.json();
      if (data.success) set({ blogs: data.data });
    } catch {
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await fetch(`${SERVER_API}/blog/categories`);
      const data = await res.json();
      if (data.success) set({ categories: data.categories });
    } catch {
    }
  },
}));
