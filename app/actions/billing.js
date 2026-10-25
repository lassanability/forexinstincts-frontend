"use server";

import { redirect } from "next/navigation";
import { request } from "@/app/lib/session";

export async function startCheckout(plan) {
  const result = await request("/web/payments/checkout", { method: "POST", body: { plan } });
  if (!result.ok) return { error: result.message };
  redirect(result.data.url);
}
