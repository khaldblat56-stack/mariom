import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/AboutPage";
import { getBundledTranslation, isSupportedLocale } from "@/lib/i18n/config";
import { buildBreadcrumbSchema, buildPageMetadata, JsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {};
  }

  const { meta } = getBundledTranslation(locale);

  return buildPageMetadata(locale, "/about", meta.about.title, meta.about.description);
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const { nav } = getBundledTranslation(locale);

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(locale, "/about", nav.about)} />
      <AboutPage />
    </>
  );
}
