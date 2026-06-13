"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/AuthStore";
import { useOrderStore } from "@/app/store/OrderStore";
import { useNewsStore } from "@/app/store/NewsStore";
import { useBlogStore } from "@/app/store/BlogStore";
import { preloadEmailRules } from "@/app/lib/emailValidation";

export function StoreInitializer({ children }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    useOrderStore.getState().fetchTiers();
    useNewsStore.getState().fetchNews();
    useBlogStore.getState().fetchBlogs();
    preloadEmailRules();
  }, []);

  return <>{children}</>;
}
