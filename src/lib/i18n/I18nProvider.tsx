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
  getLocalizedPath,
  getOppositeLocale,
  isSupportedLocale,
  LOCALE_STORAGE_KEY,
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

/**
 * One instance per provider (i.e. per locale layout) so server rendering of /ar and /en never
 * shares language state. Translations are bundled, so init is synchronous and the first render
 * — including the server render — is already translated.
 */
function createI18n(locale: Locale) {
  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    fallbackLng: DEFAULT_LOCALE,
    initAsync: false,
    interpolation: { escapeValue: false },
    lng: locale,
    react: { useSuspense: false },
    resources: {},
  });

  applyBundledTranslations(instance);

  return instance;
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const [i18n] = useState(() => createI18n(initialLocale));
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationOverlayLocale, setTranslationOverlayLocale] = useState<Locale>(initialLocale);

  useLayoutEffect(() => {
    syncDocumentLocale(initialLocale);
  }, [initialLocale]);

  const changeLocale = useCallback(
    async (nextLocale: Locale) => {
      if (!isSupportedLocale(nextLocale)) {
        return;
      }

      setTranslationOverlayLocale(nextLocale);
      setIsTranslating(true);
      await wait(TRANSLATION_LOADING_MS);
      await i18n.changeLanguage(nextLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      syncDocumentLocale(nextLocale);
      setLocale(nextLocale);
      router.push(`${getLocalizedPath(window.location.pathname, nextLocale)}${window.location.hash}`);
      setIsTranslating(false);
    },
    [i18n, router]
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
        {children}
        <LoadingOverlay
          isVisible={isTranslating}
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
