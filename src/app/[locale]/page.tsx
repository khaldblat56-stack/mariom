import { notFound } from "next/navigation";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { LoadingIntro } from "@/components/LoadingIntro";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ServicesSection } from "@/components/ServicesSection";
import { StatsSection } from "@/components/StatsSection";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SmoothScrollProvider } from "@/contexts/SmoothScrollContext";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <I18nProvider initialLocale={locale}>
      <SmoothScrollProvider>
        <MainContent>
          <LoadingIntro />
          <Navbar />
          <HeroSection />
          <StatsSection />
          <AboutSection />
          <ServicesSection />
          <PhilosophySection />
          <ContactSection />
          <WhatsAppButton phoneNumber="96891933324" />
        </MainContent>
      </SmoothScrollProvider>
    </I18nProvider>
  );
}
