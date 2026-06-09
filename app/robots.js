export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/authentication/', '/api/', '/admin/', '/_next/', '/static/'],
      },
    ],
    sitemap: 'https://forexinstincts.com/sitemap.xml',
    host: 'https://forexinstincts.com',
  };
}
