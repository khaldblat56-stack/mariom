"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Languages, Menu, X } from "lucide-react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { openBookingForm } from "@/lib/booking";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    scrollTo(target, { offset: -88 });
    window.history.replaceState(null, "", target);
    setIsMenuOpen(false);
  };

  const handleBookClick = () => {
    setIsMenuOpen(false);
    openBookingForm();
  };

  const handleTranslateClick = async () => {
    setIsMenuOpen(false);
    await toggleLocale();
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
      <nav className={`site-container flex items-center justify-between gap-4 transition-all duration-300 ${isScrolled ? "py-2 " : "py-4"}`}>
        <div className="flex items-center gap-3">
          <Image
            src="/icon.svg"
            alt=""
            width={40}
            height={40}
            className="h-20 w-20 shrink-0"
            unoptimized
            priority
          />
          {/* <span className="flex items-center gap-1 text-xl font-bold text-brand-cyan sm:text-2xl">
            {t("brand.name")} <span className="text-brand-yellow font-normal">| {t("brand.consulting")}</span>
          </span> */}
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
            onClick={handleTranslateClick}
            disabled={isTranslating}
            aria-label={t("nav.translateAria")}
            className="hidden h-11 items-center justify-center gap-2 rounded-full border border-brand-cyan/20 bg-white/85 px-5 font-bold text-brand-cyan shadow-lg transition-all hover:border-brand-cyan hover:bg-brand-cyan hover:text-white disabled:cursor-wait disabled:opacity-70 md:flex"
          >
            <Languages className="h-4 w-4" />
            <span>{t("nav.translate")}</span>
          </button>
          <button
            type="button"
            onClick={handleBookClick}
            className="hidden h-11 rounded-full bg-brand-dark px-5 font-medium text-white shadow-lg transition-all hover:bg-brand-cyan md:block"
          >
            {t("nav.book")}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-dark p-0 text-white shadow-lg transition hover:bg-brand-cyan md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`site-container overflow-hidden transition-[max-height,opacity,padding] duration-300 md:hidden ${
          isMenuOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 rounded-[1.5rem] border border-brand-cyan/10 bg-white/95 p-3 shadow-xl shadow-brand-dark/10 backdrop-blur-xl">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="rounded-2xl px-4 py-3 text-lg font-bold text-brand-dark transition hover:bg-brand-cyan/10 hover:text-brand-cyan"
            >
              {t(item.labelKey)}
            </a>
          ))}
          <button
            type="button"
            onClick={handleBookClick}
            className="rounded-2xl bg-brand-dark px-5 py-3 text-lg font-bold text-white transition hover:bg-brand-cyan"
          >
            {t("nav.book")}
          </button>
          <button
            type="button"
            onClick={handleTranslateClick}
            disabled={isTranslating}
            className="flex items-center justify-center gap-2 rounded-2xl border border-brand-cyan/20 px-5 py-3 text-lg font-bold text-brand-cyan transition hover:bg-brand-cyan hover:text-white disabled:cursor-wait disabled:opacity-70"
          >
            <Languages className="h-5 w-5" />
            {t("nav.translate")}
          </button>
        </div>
      </div>
    </header>
  );
}
