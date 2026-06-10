"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import { useNewsStore } from "@/app/store/NewsStore";

export function StoreInitializer({ children }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    useOrderStore.getState().fetchTiers();
    useNewsStore.getState().fetchNews();
  }, []);

  return <>{children}</>;
}
