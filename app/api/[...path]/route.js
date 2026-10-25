import { clientIp, trustHeaders } from "@/app/lib/upstream";

const API_BASE = (process.env.NEXT_PUBLIC_SERVER_API ?? "").replace(/\/$/, "");
const FORWARDED_HEADERS = ["accept"];
const RETURNED_HEADERS = ["content-type", "cache-control", "location"];

export async function GET(request, { params }) {
  const segments = (await params).path;
  if (segments.some((segment) => segment === ".." || segment === "." || segment.includes("\\"))) return Response.json({ status: "error", message: "Not found." }, { status: 404 });

  const path = segments.join("/");
  const headers = new Headers(trustHeaders(clientIp(request.headers)));
  FORWARDED_HEADERS.forEach((name) => request.headers.has(name) && headers.set(name, request.headers.get(name)));

  let upstream;
  try {
    upstream = await fetch(`${API_BASE}/${path}${request.nextUrl.search}`, { headers, redirect: "manual", cache: "no-store" });
  } catch {
    return Response.json({ status: "error", message: "Could not reach the server." }, { status: 502 });
  }

  const returned = new Headers();
  RETURNED_HEADERS.forEach((name) => upstream.headers.has(name) && returned.set(name, upstream.headers.get(name)));

  return new Response(upstream.body, { status: upstream.status, headers: returned });
}
