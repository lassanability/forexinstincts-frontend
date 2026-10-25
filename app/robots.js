import { absolute } from "@/app/lib/site";

const PRIVATE = ["/dashboard", "/bots", "/backtests", "/terminal", "/accounts", "/settings", "/login", "/api/"];

export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE }], sitemap: absolute("/sitemap.xml") };
}
