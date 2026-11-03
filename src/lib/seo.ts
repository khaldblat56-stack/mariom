import type { Metadata } from "next";
import { createElement } from "react";
import type { Locale } from "@/lib/i18n/config";

export const SITE_URL = "https://mariamw.com";

export const OG_IMAGE = { url: "/images/og-cover.webp", width: 1200, height: 630 };

const OG_LOCALES: Record<Locale, string> = { ar: "ar_SA", en: "en_US" };

const HOME_LABEL: Record<Locale, string> = { ar: "الرئيسية", en: "Home" };

/** Metadata for an inner page at /{locale}{path}; the locale layout supplies metadataBase and icons. */
export function buildPageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  image: typeof OG_IMAGE = OG_IMAGE,
): Metadata {
  const url = `/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `/ar${path}`,
        en: `/en${path}`,
        "x-default": `/ar${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mariam Wajeh",
      type: path.startsWith("/articles/") ? "article" : "website",
      locale: OG_LOCALES[locale],
      images: [{ ...image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

/** BreadcrumbList for an inner page: Home › {title}. */
export function buildBreadcrumbSchema(locale: Locale, path: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: HOME_LABEL[locale], item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/${locale}${path}` },
    ],
  };
}

/** Renders schema.org data; "<" is escaped so translated copy can never close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  });
}
