"use client";

import { Languages } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { NAV_ITEMS } from "@/lib/site-content";

const SECTION_IDS = NAV_ITEMS.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1));
/** Below this scroll position the hero is in view, so no section link is highlighted. */
const HERO_SCROLL_PX = 240;
/** Past this scroll position the header switches from transparent to its solid style. */
const SCROLLED_PX = 12;

/** Id of the home-page section currently crossing the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveId(null);
      return;
    }

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) {
          setActiveId(hit.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    const handleScroll = () => {
      if (window.scrollY < HERO_SCROLL_PX) {
        setActiveId(null);
      }
    };

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled]);

  return activeId;
}

export function Navbar() {
  const { t } = useTranslation();
  const { locale, isTranslating, toggleLocale } = useI18nControls();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useActiveSection(pathname === `/${locale}`);

  const isCurrent = (href: string) => {
    if (href.startsWith("/")) {
      return pathname === `/${locale}${href}` ? ("page" as const) : undefined;
    }
    return activeSection === href.slice(1) ? ("location" as const) : undefined;
  };
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > SCROLLED_PX);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const handleTranslateClick = async () => {
    closeMenu();
    await toggleLocale();
  };

  return (
    <header className="nav" data-scrolled={isScrolled || undefined} data-menu-open={isMenuOpen || undefined}>
      <div className="wrap nav-bar">
        <SiteLink className="logo" href="#top" aria-label={t("brand.name")} onClick={closeMenu}>
          <Image src="/images/logo.webp" alt="" width={64} height={64} priority />
        </SiteLink>

        <nav className="nav-links" aria-label={t("nav.menu")}>
          {NAV_ITEMS.map((item) => (
            <SiteLink key={item.key} href={item.href} aria-current={isCurrent(item.href)}>
              {t(`nav.${item.key}`)}
            </SiteLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="lang-btn"
            onClick={handleTranslateClick}
            disabled={isTranslating}
            aria-label={t("nav.translateAria")}
          >
            <Languages aria-hidden="true" />
            <span>{t("nav.translate")}</span>
          </button>
          <SiteLink className="btn btn-dark nav-book" href="#contact" onClick={closeMenu}>
            <CalendarIcon />
            {t("nav.book")}
          </SiteLink>
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!isMenuOpen}>
        <nav className="wrap mobile-menu-panel" aria-label={t("nav.menu")}>
          {NAV_ITEMS.map((item) => (
            <SiteLink key={item.key} href={item.href} aria-current={isCurrent(item.href)} onClick={closeMenu}>
              {t(`nav.${item.key}`)}
            </SiteLink>
          ))}
          <div className="mobile-menu-actions">
            <button
              type="button"
              className="lang-btn"
              onClick={handleTranslateClick}
              disabled={isTranslating}
              aria-label={t("nav.translateAria")}
            >
              <Languages aria-hidden="true" />
              <span>{t("nav.languageName")}</span>
            </button>
            <SiteLink className="btn btn-dark" href="#contact" onClick={closeMenu}>
              <CalendarIcon />
              {t("nav.book")}
            </SiteLink>
          </div>
        </nav>
      </div>
      {isMenuOpen ? (
        <button type="button" className="menu-scrim" aria-label={t("nav.closeMenu")} onClick={closeMenu} />
      ) : null}
    </header>
  );
}
