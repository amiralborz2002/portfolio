import type { MetadataRoute } from "next";

// Serves a valid /robots.txt (Lighthouse SEO audit) that lets crawlers index the whole site.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
