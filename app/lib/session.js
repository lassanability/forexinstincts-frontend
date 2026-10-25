import "server-only";
import { cookies, headers } from "next/headers";
import { API_BASE } from "@/app/lib/api";
import { clientIp, trustHeaders } from "@/app/lib/upstream";

const COOKIE = { access: "fi_access", refresh: "fi_refresh" };

const ACCESS_SECONDS = 55 * 60;
const REFRESH_SECONDS = 30 * 24 * 60 * 60;
const REQUEST_TIMEOUT_MS = 20000;

const options = (maxAge) => ({ httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });

export const accessToken = async () => (await cookies()).get(COOKIE.access)?.value ?? null;

export const isSignedIn = async () => Boolean((await cookies()).get(COOKIE.refresh)?.value);

export const saveTokens = async ({ accessToken: access, refreshToken }) => {
  const store = await cookies();
  store.set(COOKIE.access, access, options(ACCESS_SECONDS));
  store.set(COOKIE.refresh, refreshToken, options(REFRESH_SECONDS));
};

export const clearTokens = async () => {
  const store = await cookies();
  store.delete(COOKIE.access);
  store.delete(COOKIE.refresh);
};

export const request = async (path, { method = "GET", body } = {}) => {
  const token = await accessToken();

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        "content-type": "application/json",
        ...trustHeaders(clientIp(await headers())),
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));

    return { ok: response.ok, status: response.status, data: payload.data ?? null, message: payload.message ?? "Something went wrong. Please try again." };
  } catch {
    return { ok: false, status: 0, data: null, message: "We could not reach the server. Please try again." };
  }
};
