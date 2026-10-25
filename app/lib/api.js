import { cache } from "react";
import { trustHeaders } from "@/app/lib/upstream";

export const API_BASE = (process.env.NEXT_PUBLIC_SERVER_API ?? "").replace(/\/$/, "");
const REVALIDATE_SECONDS = 60;
const STATIC_REVALIDATE_SECONDS = 300;

const get = async (path, { revalidate = REVALIDATE_SECONDS } = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { next: { revalidate }, headers: trustHeaders() });
  } catch {
    return null;
  }
  if (!response.ok) return null;
  return (await response.json().catch(() => ({}))).data ?? null;
};

export const getConfig = cache(() => get("/config"));

export const getStrategies = cache(() => get("/strategies", { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getStrategy = cache((key) => get(`/strategies/${encodeURIComponent(key)}`, { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getMarkets = cache(() => get("/markets", { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getMarketplace = cache(() => get("/marketplace"));

export const getPreset = cache((slug) => get(`/marketplace/${encodeURIComponent(slug)}`));

export const getPosts = cache((limit = 12, skip = 0) => get(`/posts?limit=${limit}&skip=${skip}`, { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getPost = cache((slug) => get(`/posts/${encodeURIComponent(slug)}`, { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getPages = cache(() => get("/pages", { revalidate: STATIC_REVALIDATE_SECONDS }));

export const getPage = cache((slug) => get(`/pages/${encodeURIComponent(slug)}`, { revalidate: STATIC_REVALIDATE_SECONDS }));
