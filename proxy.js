import { NextResponse } from "next/server";
import { clientIp, trustHeaders } from "@/app/lib/upstream";

const API_BASE = (process.env.NEXT_PUBLIC_SERVER_API ?? "").replace(/\/$/, "");
const ACCESS_COOKIE = "fi_access";
const REFRESH_COOKIE = "fi_refresh";
const ACCESS_SECONDS = 55 * 60;
const REFRESH_SECONDS = 30 * 24 * 60 * 60;

const options = (maxAge) => ({ httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });

const refreshTokens = async (refreshToken, ip) => {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "content-type": "application/json", ...trustHeaders(ip) },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (response.ok) return (await response.json()).data;
    return response.status < 500 && response.status !== 429 ? false : null;
  } catch {
    return null;
  }
};

export async function proxy(request) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh || request.cookies.has(ACCESS_COOKIE)) return NextResponse.next();

  const tokens = await refreshTokens(refresh, clientIp(request.headers));
  if (tokens === null) return NextResponse.next();

  if (tokens) {
    request.cookies.set(ACCESS_COOKIE, tokens.accessToken);
    request.cookies.set(REFRESH_COOKIE, tokens.refreshToken);
  } else request.cookies.delete(REFRESH_COOKIE);

  const response = NextResponse.next({ request });
  if (tokens) {
    response.cookies.set(ACCESS_COOKIE, tokens.accessToken, options(ACCESS_SECONDS));
    response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, options(REFRESH_SECONDS));
  } else response.cookies.delete(REFRESH_COOKIE);
  return response;
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
