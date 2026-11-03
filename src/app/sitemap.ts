import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo";
import { ARTICLES } from "@/lib/site-content";

type Page = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: string;
};

const PAGES: Page[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "yearly" },
  { path: "/results", priority: 0.8, changeFrequency: "monthly" },
  ...ARTICLES.map(
    (article): Page => ({
      path: `/articles/${article.slug}`,
      priority: 0.6,
      changeFrequency: "yearly",
      lastModified: "datePublished" in article ? article.datePublished : undefined,
    }),
  ),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority, changeFrequency, lastModified }) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(SUPPORTED_LOCALES.map((alt) => [alt, `${SITE_URL}/${alt}${path}`])),
      },
    })),
  );
}
