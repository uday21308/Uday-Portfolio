import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://uday-kiran-battula.vercel.app", lastModified: new Date() },
  ];
}
