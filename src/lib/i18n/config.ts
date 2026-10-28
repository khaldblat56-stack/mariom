import type { i18n as I18nInstance } from "i18next";
import arTranslation from "../../../public/ar.json";
import enTranslation from "../../../public/en.json";

export const DEFAULT_LOCALE = "ar";
export const LOCALE_STORAGE_KEY = "mriom-locale";
export const SUPPORTED_LOCALES = ["ar", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const BUNDLED_TRANSLATIONS: Record<Locale, typeof arTranslation> = {
  ar: arTranslation,
  en: enTranslation,
};

export function applyBundledTranslations(i18nInstance: I18nInstance) {
  for (const locale of SUPPORTED_LOCALES) {
    if (!i18nInstance.hasResourceBundle(locale, "translation")) {
      i18nInstance.addResourceBundle(locale, "translation", BUNDLED_TRANSLATIONS[locale], true, true);
    }
  }
}

/** Raw translation JSON for server-side use (e.g. generateMetadata), where the i18next instance isn't available. */
export function getBundledTranslation(locale: Locale) {
  return BUNDLED_TRANSLATIONS[locale];
}

/** Swaps the leading locale segment of a pathname, e.g. /ar/about -> /en/about. */
export function getLocalizedPath(pathname: string, locale: Locale) {
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");
  return `/${locale}${rest}`;
}

export function isSupportedLocale(locale: string | null): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

export function getLocaleDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getOppositeLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

export function syncDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = getLocaleDirection(locale);
}
