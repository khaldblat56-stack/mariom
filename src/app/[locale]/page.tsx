import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { HeroSection } from "@/components/HeroSection";
import { LoadingIntro } from "@/components/LoadingIntro";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";

const StatsSection = dynamic(() =>
  import("@/components/StatsSection").then((m) => ({ default: m.StatsSection })),
);

const PartnersSlider = dynamic(() => import("@/components/PartnersSlider/PartnersSlider"));

const AboutSection = dynamic(() =>
  import("@/components/AboutSection").then((m) => ({ default: m.AboutSection })),
);

const ServicesSection = dynamic(() =>
  import("@/components/ServicesSection").then((m) => ({ default: m.ServicesSection })),
);

const PhilosophySection = dynamic(() =>
  import("@/components/PhilosophySection").then((m) => ({ default: m.PhilosophySection })),
);

const ContactSection = dynamic(() =>
  import("@/components/ContactSection").then((m) => ({ default: m.ContactSection })),
);

const WhatsAppButton = dynamic(() =>
  import("@/components/whatsapp-button").then((m) => ({ default: m.WhatsAppButton })),
);

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <MainContent>
      <LoadingIntro />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <PartnersSlider />
      <AboutSection />
      <ServicesSection />
      <PhilosophySection />
      <ContactSection />
      <WhatsAppButton phoneNumber="+96891933324" />
    </MainContent>
  );
}
