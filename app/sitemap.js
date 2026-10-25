import { getMarketplace, getPages, getPosts, getStrategies } from "@/app/lib/api";
import { absolute } from "@/app/lib/site";

const STATIC = ["/", "/strategies", "/marketplace", "/plans", "/blog", "/contact"];

export default async function sitemap() {
  const [strategies, presets, posts, pages] = await Promise.all([getStrategies(), getMarketplace(), getPosts(50), getPages()]);
  const now = new Date();

  return [
    ...STATIC.map((path) => ({ url: absolute(path), lastModified: now, priority: path === "/" ? 1 : 0.8 })),
    ...(strategies ?? []).map((strategy) => ({ url: absolute(`/strategies/${strategy.key}`), lastModified: now, priority: 0.7 })),
    ...(presets ?? []).map((preset) => ({ url: absolute(`/marketplace/${preset.slug}`), lastModified: new Date(preset.updatedAt), priority: 0.6 })),
    ...(posts ?? []).map((post) => ({ url: absolute(`/blog/${post.slug}`), lastModified: new Date(post.publishedAt), priority: 0.6 })),
    ...(pages ?? []).filter((page) => page.slug !== "contact").map((page) => ({ url: absolute(`/${page.slug}`), lastModified: now, priority: 0.3 })),
  ];
}
