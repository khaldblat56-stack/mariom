import { notFound } from "next/navigation";

import { ArticlesSection } from "@/components/ArticlesSection";
import { BrandsSection } from "@/components/BrandsSection";
import { FaqSection } from "@/components/FaqSection";
import { HeroSection } from "@/components/HeroSection";
import { LoadingIntro } from "@/components/LoadingIntro";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ServicesSection } from "@/components/ServicesSection";
import { StatsSection } from "@/components/StatsSection";
import { getBundledTranslation, isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/** Sections are imported statically (not next/dynamic) so in-page anchors like /ar#faq resolve on arrival. */
export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getBundledTranslation(locale).faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <LoadingIntro />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PhilosophySection />
      <BrandsSection />
      <ArticlesSection />
      <FaqSection />
    </>
  );
}
