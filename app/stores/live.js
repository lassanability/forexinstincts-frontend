import { create } from "zustand";

const MAX_NOTES = 30;

export const useLive = create((set) => ({
  status: "connecting",
  bots: {},
  trades: {},
  quotes: {},
  notes: [],
  setStatus: (status) => set({ status }),
  receive: ({ type, data }) =>
    set((state) => {
      if (type === "bot") return { bots: { ...state.bots, [data.id]: data } };
      if (type === "trade") return { trades: { ...state.trades, [data.id]: data } };
      if (type === "trade:live") return { quotes: { ...state.quotes, [data.id]: data } };
      if (type === "bot:note") return { notes: [data, ...state.notes].slice(0, MAX_NOTES) };
      return state;
    }),
}));
