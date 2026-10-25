"use server";

import { redirect } from "next/navigation";
import { accessToken, clearTokens, request, saveTokens } from "@/app/lib/session";

const DEFAULT_NEXT = "/dashboard";
const LOCAL_ORIGIN = "https://local.invalid";

const safeNext = (value) => {
  if (typeof value !== "string" || !value.startsWith("/")) return DEFAULT_NEXT;
  const url = new URL(value, LOCAL_ORIGIN);
  return url.origin === LOCAL_ORIGIN ? `${url.pathname}${url.search}` : DEFAULT_NEXT;
};

const field = (form, name) => String(form.get(name) ?? "").trim();

export async function requestCode(_, form) {
  const email = field(form, "email");
  const result = await request("/auth/code", { method: "POST", body: { email } });
  return result.ok ? { email, sent: true } : { email, error: result.message };
}

export async function verifyCode(_, form) {
  const email = field(form, "email");
  const result = await request("/auth/verify-code", { method: "POST", body: { email, code: field(form, "code") } });
  if (!result.ok) return { email, sent: true, error: result.message };

  await saveTokens(result.data);
  redirect(safeNext(field(form, "next")));
}

export async function signOut() {
  await request("/auth/sign-out", { method: "POST" });
  await clearTokens();
  redirect("/");
}

export async function liveToken() {
  return accessToken();
}

export async function sendContact(_, form) {
  const result = await request("/contact", { method: "POST", body: { name: field(form, "name"), email: field(form, "email"), subject: field(form, "subject"), message: field(form, "message") } });
  return result.ok ? { sent: true } : { error: result.message };
}
