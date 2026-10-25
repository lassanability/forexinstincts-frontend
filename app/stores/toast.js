import { create } from "zustand";

const LIFETIME_MS = 4500;
let counter = 0;

export const useToasts = create((set) => ({
  items: [],
  push: (tone, message, title) => {
    const id = ++counter;
    set((state) => ({ items: [...state.items, { id, tone, message, title }] }));
    setTimeout(() => set((state) => ({ items: state.items.filter((item) => item.id !== id) })), LIFETIME_MS);
  },
}));

export const toast = {
  success: (message, title) => useToasts.getState().push("success", message, title),
  error: (message, title) => useToasts.getState().push("error", message, title),
  info: (message, title) => useToasts.getState().push("info", message, title),
};
