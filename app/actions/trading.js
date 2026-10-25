"use server";

import { revalidatePath } from "next/cache";
import { request } from "@/app/lib/session";

const result = (response, path) => {
  if (path && response.ok) revalidatePath(path);
  return response.ok ? { data: response.data, message: response.message } : { error: response.message };
};

export async function linkAccount(token) {
  return result(await request("/web/accounts", { method: "POST", body: { token } }), "/accounts");
}

export async function refreshAccounts() {
  return result(await request("/web/accounts/refresh", { method: "POST" }), "/accounts");
}

export async function removeAccount(id) {
  return result(await request(`/web/accounts/${id}`, { method: "DELETE" }), "/accounts");
}

export async function saveBot(id, body) {
  return result(await request(id ? `/web/bots/${id}` : "/web/bots", { method: id ? "PUT" : "POST", body }), "/bots");
}

export async function deleteBot(id) {
  return result(await request(`/web/bots/${id}`, { method: "DELETE" }), "/bots");
}

export async function startBot(id, acceptLadderRisk = false) {
  return result(await request(`/web/bots/${id}/start`, { method: "POST", body: { acceptLadderRisk } }), "/bots");
}

export async function stopBot(id, close = false) {
  return result(await request(`/web/bots/${id}/stop`, { method: "POST", body: { close } }), "/bots");
}

export async function killAll() {
  return result(await request("/web/bots/kill", { method: "POST" }), "/dashboard");
}

export async function previewBot(body) {
  return result(await request("/web/bots/preview", { method: "POST", body }));
}

export async function usePreset(slug, accountId) {
  return result(await request(`/web/marketplace/${slug}/use`, { method: "POST", body: { accountId } }), "/bots");
}

export async function runBacktest(body) {
  return result(await request("/web/backtests", { method: "POST", body }), "/backtests");
}

export async function deleteBacktest(id) {
  return result(await request(`/web/backtests/${id}`, { method: "DELETE" }), "/backtests");
}

export async function loadBacktest(id) {
  return result(await request(`/web/backtests/${id}`));
}

export async function terminalBuy(body) {
  return result(await request("/web/terminal/buy", { method: "POST", body }));
}

export async function terminalSell(accountId, contractId) {
  return result(await request("/web/terminal/sell", { method: "POST", body: { accountId, contractId } }));
}

export async function loadPositions(accountId) {
  return result(await request(`/web/terminal/positions?account=${encodeURIComponent(accountId)}`));
}

export async function loadBalance(accountId) {
  return result(await request(`/web/terminal/balance?account=${encodeURIComponent(accountId)}`));
}

export async function saveProfile(body) {
  return result(await request("/auth/me", { method: "PUT", body }), "/settings");
}

export async function loadTrades(query = "") {
  return result(await request(`/web/trades${query}`));
}
