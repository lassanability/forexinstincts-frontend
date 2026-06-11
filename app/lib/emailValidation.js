const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const RULES_CACHE_KEY = "fi_email_rules";
const RULES_CACHE_TTL = 30 * 60 * 1000;

let memoryCache = null;

async function fetchRules() {
  try {
    const stored = sessionStorage.getItem(RULES_CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.ts < RULES_CACHE_TTL) {
        memoryCache = parsed.rules;
        return;
      }
    }
    const res = await fetch(`${SERVER_API}/user/email-rules`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && data.data) {
      memoryCache = data.data;
      sessionStorage.setItem(RULES_CACHE_KEY, JSON.stringify({ rules: data.data, ts: Date.now() }));
    }
  } catch {
    // backend validation is the authoritative check
  }
}

function matchesRules(email, rules) {
  if (!rules) return false;
  const domain = email.toLowerCase().split("@")[1];
  if (!domain) return true;
  if (rules.domains?.includes(domain)) return true;
  return rules.keywords?.some((kw) => domain.includes(kw)) ?? false;
}

export async function getEmailValidationError(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email.trim())) return "Please enter a valid email address";
  if (!memoryCache) await fetchRules();
  if (matchesRules(email.trim(), memoryCache))
    return "Temporary or disposable email addresses are not permitted. Please use a real email address.";
  return null;
}

export function preloadEmailRules() {
  if (typeof window !== "undefined") fetchRules();
}
