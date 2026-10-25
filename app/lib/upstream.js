export const clientIp = (headers) => headers.get("x-forwarded-for")?.split(",").at(-1).trim();

export const trustHeaders = (ip) => (process.env.PROXY_SECRET ? { "x-proxy-secret": process.env.PROXY_SECRET, ...(ip && { "x-client-ip": ip }) } : {});
