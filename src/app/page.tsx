import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { LoadingIntro } from "@/components/LoadingIntro";
import { MainContent } from "@/components/MainContent";
import { Navbar } from "@/components/Navbar";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <MainContent>
      <LoadingIntro />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PhilosophySection />
      <ContactSection />
    </MainContent>
  );
}
