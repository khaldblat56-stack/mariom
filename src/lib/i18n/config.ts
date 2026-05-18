import type { Resource } from "i18next";
import type { i18n as I18nInstance } from "i18next";
import arTranslation from "../../../public/ar.json";
import enTranslation from "../../../public/en.json";

export const DEFAULT_LOCALE = "ar";
export const LOCALE_STORAGE_KEY = "mriom-locale";
export const SUPPORTED_LOCALES = ["ar", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const resourceCache = new Map<Locale, Resource[string]>();

const BUNDLED_TRANSLATIONS: Record<Locale, typeof arTranslation> = {
  ar: arTranslation,
  en: enTranslation,
};

/** Ensures overlay strings exist if bundled JSON fails to register */
export const MIN_FALLBACK_TRANSLATION = {
  loading: {
    intro: "…",
    label: "Loading",
  },
} as const;

export function applyBundledTranslations(i18nInstance: I18nInstance) {
  for (const locale of SUPPORTED_LOCALES) {
    if (!i18nInstance.hasResourceBundle(locale, "translation")) {
      i18nInstance.addResourceBundle(locale, "translation", BUNDLED_TRANSLATIONS[locale], true, true);
    }
  }
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

export async function loadLocaleResources(locale: Locale): Promise<Resource[string]> {
  const cachedResource = resourceCache.get(locale);

  if (cachedResource) {
    return cachedResource;
  }

  const translation = BUNDLED_TRANSLATIONS[locale];
  if (!translation) {
    throw new Error(`No bundled translations for locale: ${locale}`);
  }

  const resource = { translation };
  resourceCache.set(locale, resource);

  return resource;
}
