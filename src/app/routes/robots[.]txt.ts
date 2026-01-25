import { getSiteUrl } from "@/shared/config/seo";

export function loader() {
  const siteUrl = getSiteUrl();

  const robotsTxt = `# robots.txt for ${siteUrl}
User-agent: *
Allow: /

# Disallow authentication and private pages
Disallow: /login
Disallow: /signup
Disallow: /logout
Disallow: /dashboard
Disallow: /api/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
