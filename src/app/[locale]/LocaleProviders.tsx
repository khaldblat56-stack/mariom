"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/contexts/SmoothScrollContext";
import type { Locale } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

export function LocaleProviders({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <I18nProvider initialLocale={locale}>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </I18nProvider>
  );
}
