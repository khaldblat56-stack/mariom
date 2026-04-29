import type { Resource } from "i18next";

export const DEFAULT_LOCALE = "ar";
export const LOCALE_STORAGE_KEY = "mriom-locale";
export const SUPPORTED_LOCALES = ["ar", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const resourceCache = new Map<Locale, Resource[string]>();

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

  const response = await fetch(`/api/translations/${locale}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to load ${locale} translations`);
  }

  const resource = { translation: await response.json() };
  resourceCache.set(locale, resource);

  return resource;
}
