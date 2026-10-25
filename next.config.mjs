const IMAGE_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const SERVER_ORIGIN = new URL(process.env.NEXT_PUBLIC_SERVER_API || "http://localhost").origin;

const SITE = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://forexinstincts.com");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const FRAMING = {
  page: [
    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  ],
};

const BLOCKING_BOTS =
  /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot/i;

const nextConfig = {
  agentRules: false,
  output: "standalone",
  poweredByHeader: false,
  htmlLimitedBots: BLOCKING_BOTS,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 604800,
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https", hostname })),
  },
  async rewrites() {
    return [
      { source: "/ws/live", destination: `${SERVER_ORIGIN}/ws/live` },
    ];
  },
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: `www.${SITE.host}` }], destination: `${SITE.origin}/:path*`, permanent: true },
      { source: "/tiers", destination: "/plans", permanent: true },
      { source: "/authentication/:path*", destination: "/login", permanent: true },
      { source: "/buildbot", destination: "/bots/new", permanent: true },
      { source: "/success-stories", destination: "/marketplace", permanent: true },
      { source: "/news", destination: "/blog", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/:path*", headers: FRAMING.page },
    ];
  },
};

export default nextConfig;
