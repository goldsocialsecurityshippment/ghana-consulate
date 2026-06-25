import { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/iphones";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.acemobilehub.com";
  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/collection`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/sell`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/swap`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/installment`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/comparison`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/how-it-works`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
  ];
  const iphonePages = getAllSlugs().map(slug => ({
    url: `${baseUrl}/iphone/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...iphonePages];
}
