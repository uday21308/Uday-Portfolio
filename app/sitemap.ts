import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://udaykiran.vercel.app", lastModified: new Date() },
  ];
}
