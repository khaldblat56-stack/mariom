import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/ArticlePage";
import { getBundledTranslation, isSupportedLocale } from "@/lib/i18n/config";
import { buildBreadcrumbSchema, buildPageMetadata, JsonLd, OG_IMAGE, SITE_URL } from "@/lib/seo";
import { ARTICLES, getArticleIndex } from "@/lib/site-content";

type ArticleParams = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const index = getArticleIndex(slug);

  if (!isSupportedLocale(locale) || index === -1) {
    return {};
  }

  const article = getBundledTranslation(locale).articles.items[index];

  const author = locale === "ar" ? "مريم وجيه الأعور" : "Mariam Wajeh Alawar";

  return buildPageMetadata(locale, `/articles/${slug}`, `${article.title} | ${author}`, article.excerpt);
}

export default async function Article({ params }: ArticleParams) {
  const { locale, slug } = await params;
  const index = getArticleIndex(slug);

  if (!isSupportedLocale(locale) || index === -1) {
    notFound();
  }

  const path = `/articles/${slug}`;
  const article = getBundledTranslation(locale).articles.items[index];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.tag,
    inLanguage: locale,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    mainEntityOfPage: `${SITE_URL}/${locale}${path}`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={buildBreadcrumbSchema(locale, path, article.title)} />
      <ArticlePage index={index} />
    </>
  );
}
