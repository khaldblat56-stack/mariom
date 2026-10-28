"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingOverlay } from "./LoadingOverlay";

const FADE_DURATION_MS = 300;
const AUTO_DISMISS_MS = 900;
const INTRO_SEEN_STORAGE_KEY = "mriom-loading-intro-seen";

export function LoadingIntro() {
  const { t } = useTranslation();
  // Rendered visible on the server so first-time visitors never see content flash before the intro.
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(INTRO_SEEN_STORAGE_KEY, "true");
    setIsVisible(false);
    window.setTimeout(() => {
      document.documentElement.dataset.loadingIntro = "done";
      setIsMounted(false);
    }, FADE_DURATION_MS);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(INTRO_SEEN_STORAGE_KEY) === "true") {
      document.documentElement.dataset.loadingIntro = "done";
      setIsVisible(false);
      setIsMounted(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) {
      document.documentElement.dataset.loadingIntro = "done";
      return;
    }

    const events = ["mousemove", "click", "touchstart", "keydown"] as const;
    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS);

    document.documentElement.dataset.loadingIntro = "active";

    events.forEach((event) => {
      window.addEventListener(event, dismiss, { once: true, passive: true });
    });

    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, dismiss));
      document.documentElement.dataset.loadingIntro = "done";
    };
  }, [dismiss, isMounted]);

  if (!isMounted) {
    return null;
  }

  return <LoadingOverlay isVisible={isVisible} text={t("loading.intro")} label={t("loading.label")} />;
}
