const BASE = 'https://forexinstincts.com';
const SERVER = process.env.NEXT_PUBLIC_SERVER_API || 'https://server.forexinstincts.com/api/v1';

async function fetchIds(endpoint) {
  try {
    const res = await fetch(`${SERVER}/${endpoint}?limit=500`, { next: { revalidate: 43200 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.data) ? data.data.map(item => item._id).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [blogIds, newsIds] = await Promise.all([
    fetchIds('blog'),
    fetchIds('news'),
  ]);

  const staticRoutes = [
    { url: `${BASE}/`,          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/tiers`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE}/buildbot`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${BASE}/news`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${BASE}/about`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/privacy`,   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const blogRoutes = blogIds.map(id => ({
    url: `${BASE}/blog/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsRoutes = newsIds.map(id => ({
    url: `${BASE}/news/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...newsRoutes];
}
