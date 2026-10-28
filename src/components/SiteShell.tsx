"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { BookingForm } from "@/components/BookingForm";
import { ContactSection } from "@/components/ContactSection";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getLocaleDirection } from "@/lib/i18n/config";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { WHATSAPP_NUMBER } from "@/lib/site-content";

/** Chrome shared by every page: nav, page content, contact band, footer and booking modal. */
export function SiteShell({ children }: { children: ReactNode }) {
  const { locale } = useI18nControls();
  const pathname = usePathname();

  /** Client-side navigations to another page's section (e.g. /ar/about → /ar#faq) land at the top otherwise. */
  useEffect(() => {
    const { hash } = window.location;

    if (!hash) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  return (
    <div className="site" dir={getLocaleDirection(locale)} lang={locale}>
      <Navbar />
      <main id="top">{children}</main>
      <ContactSection />
      <SiteFooter />
      <BookingForm />
      <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
