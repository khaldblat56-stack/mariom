"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingOverlay } from "./LoadingOverlay";

const FADE_DURATION_MS = 300;
const AUTO_DISMISS_MS = 900;

export function LoadingIntro() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => {
      document.documentElement.dataset.loadingIntro = "done";
      setIsMounted(false);
    }, FADE_DURATION_MS);
  }, []);

  useEffect(() => {
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
  }, [dismiss]);

  if (!isMounted) {
    return null;
  }

  return <LoadingOverlay isVisible={isVisible} text={t("loading.intro")} label={t("loading.label")} />;
}
