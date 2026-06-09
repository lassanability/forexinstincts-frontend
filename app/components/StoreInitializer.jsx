"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";

export function StoreInitializer({ children }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    useOrderStore.getState().fetchTiers();
  }, []);

  return <>{children}</>;
}
