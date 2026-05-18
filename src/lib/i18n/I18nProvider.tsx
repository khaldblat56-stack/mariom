"use client";

import i18next from "i18next";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  applyBundledTranslations,
  DEFAULT_LOCALE,
  getOppositeLocale,
  isSupportedLocale,
  loadLocaleResources,
  LOCALE_STORAGE_KEY,
  MIN_FALLBACK_TRANSLATION,
  type Locale,
  syncDocumentLocale,
} from "./config";

const TRANSLATION_LOADING_MS = 700;

type I18nControls = {
  locale: Locale;
  isTranslating: boolean;
  toggleLocale: () => Promise<void>;
};

const I18nControlsContext = createContext<I18nControls | null>(null);

const i18n = i18next.createInstance();

void i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
  lng: DEFAULT_LOCALE,
  react: { useSuspense: false },
  resources: {},
});

applyBundledTranslations(i18n);

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function ensureLocaleResources(locale: Locale) {
  if (i18n.hasResourceBundle(locale, "translation")) {
    return;
  }

  try {
    const resource = await loadLocaleResources(locale);
    i18n.addResourceBundle(locale, "translation", resource.translation, true, true);
  } catch {
    i18n.addResourceBundle(locale, "translation", MIN_FALLBACK_TRANSLATION, true, true);
  }
}

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [isReady, setIsReady] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationOverlayLocale, setTranslationOverlayLocale] = useState<Locale>(initialLocale);

  useLayoutEffect(() => {
    let cancelled = false;

    async function loadInitialLocale() {
      syncDocumentLocale(initialLocale);

      try {
        await ensureLocaleResources(initialLocale);
        await i18n.changeLanguage(initialLocale);
      } catch {
        applyBundledTranslations(i18n);
        i18n.addResourceBundle(initialLocale, "translation", MIN_FALLBACK_TRANSLATION, true, true);
        await i18n.changeLanguage(initialLocale);
      } finally {
        if (!cancelled) {
          setLocale(initialLocale);
          setIsReady(true);
        }
      }
    }

    void loadInitialLocale();

    return () => {
      cancelled = true;
    };
  }, [initialLocale]);

  const changeLocale = useCallback(
    async (nextLocale: Locale) => {
      if (!isSupportedLocale(nextLocale)) {
        return;
      }

      await ensureLocaleResources(nextLocale);
      setTranslationOverlayLocale(nextLocale);
      setIsTranslating(true);
      await wait(TRANSLATION_LOADING_MS);
      await i18n.changeLanguage(nextLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      syncDocumentLocale(nextLocale);
      setLocale(nextLocale);
      router.push(`/${nextLocale}${window.location.hash}`);
      setIsTranslating(false);
    },
    [router]
  );

  const toggleLocale = useCallback(async () => {
    await changeLocale(getOppositeLocale(locale));
  }, [changeLocale, locale]);

  const controls = useMemo(
    () => ({
      locale,
      isTranslating,
      toggleLocale,
    }),
    [isTranslating, locale, toggleLocale]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <I18nControlsContext.Provider value={controls}>
        {isReady ? children : null}
        <LoadingOverlay
          isVisible={!isReady || isTranslating}
          text={i18n.t("loading.intro", {
            lng: isTranslating ? translationOverlayLocale : initialLocale,
          })}
          label={i18n.t("loading.label", {
            lng: isTranslating ? translationOverlayLocale : initialLocale,
          })}
        />
      </I18nControlsContext.Provider>
    </I18nextProvider>
  );
}

export function useI18nControls() {
  const controls = useContext(I18nControlsContext);

  if (!controls) {
    throw new Error("useI18nControls must be used inside I18nProvider");
  }

  return controls;
}
