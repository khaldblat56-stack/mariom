"use client";

import { useCallback, useEffect, useState } from "react";

const FADE_DURATION_MS = 300;
const AUTO_DISMISS_MS = 900;

export function LoadingIntro() {
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

  return (
    <div
      aria-live="polite"
      aria-busy={isVisible}
      className={`hero-surface fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden px-4 py-8 transition-all duration-300 motion-reduce:duration-150 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="hero-dot-field pointer-events-none absolute inset-x-0 top-20 h-96 opacity-25" />
      <div className="animate-soft-float-slow pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-brand-cyan/10 blur-[90px]" />
      <div className="animate-soft-float pointer-events-none absolute left-[8%] bottom-20 h-72 w-72 rounded-full bg-brand-yellow/15 blur-[100px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <div className="rounded-full border border-brand-cyan/15 bg-white/82 px-7 py-4 shadow-2xl shadow-brand-dark/10 backdrop-blur-xl md:px-10 md:py-5">
          <p className="text-xl font-bold leading-relaxed text-brand-dark md:text-3xl">
            المشكلة غالباً تكمن في الجوهر لا في الوسيلة
          </p>
        </div>
        <div className="flex items-center gap-3" aria-label="جاري التحميل">
          <span className="loading-dot bg-brand-cyan" />
          <span className="loading-dot bg-brand-yellow [animation-delay:150ms]" />
          <span className="loading-dot bg-brand-dark [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
