"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { useI18nControls } from "@/lib/i18n/I18nProvider";

const navItems = [
  { href: "#about", labelKey: "nav.about" },
  { href: "#services", labelKey: "nav.services" },
  { href: "#philosophy", labelKey: "nav.philosophy" },
];

export function Navbar() {
  const { t } = useTranslation();
  const { isTranslating, toggleLocale } = useI18nControls();
  const { scrollTo } = useSmoothScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    scrollTo(target, { offset: -88 });
    window.history.replaceState(null, "", target);
  };

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-[0_16px_40px_rgba(26,26,26,0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className={`main-content flex justify-between items-center gap-4 transition-all duration-300 ${isScrolled ? "py-3" : "py-4"}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-cyan flex items-center gap-1">
            {t("brand.name")} <span className="text-brand-yellow font-normal">| {t("brand.consulting")}</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="relative py-2 hover:text-brand-cyan transition-colors after:absolute after:right-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-cyan after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(item.labelKey)}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            disabled={isTranslating}
            aria-label={t("nav.translateAria")}
            className="flex items-center justify-center gap-2 rounded-full border border-brand-cyan/20 bg-white/85 px-4 py-2.5 font-bold text-brand-cyan shadow-lg transition-all hover:border-brand-cyan hover:bg-brand-cyan hover:text-white disabled:cursor-wait disabled:opacity-70"
          >
            <Languages className="h-4 w-4" />
            <span>{t("nav.translate")}</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#contact", { offset: -88 })}
            className="bg-brand-dark text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-cyan transition-all shadow-lg"
          >
            {t("nav.book")}
          </button>
        </div>
      </nav>
    </header>
  );
}
