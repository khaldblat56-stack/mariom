"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { useI18nControls } from "@/lib/i18n/I18nProvider";

const HEADER_OFFSET = -88;

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** "/about" for a page under the current locale, "#section" for a section, or "#top". */
  href: string;
};

/**
 * Locale-aware link. Section links smooth-scroll when the section is on the current page
 * (e.g. #contact exists on every page), otherwise they navigate to the home page section.
 */
export function SiteLink({ href, onClick, ...props }: SiteLinkProps) {
  const { locale } = useI18nControls();
  const { scrollTo } = useSmoothScroll();
  const isSection = href.startsWith("#");
  const target = isSection ? `/${locale}${href === "#top" ? "" : href}` : `/${locale}${href}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!isSection || event.defaultPrevented) {
      return;
    }

    if (href === "#top") {
      if (window.location.pathname === `/${locale}`) {
        event.preventDefault();
        scrollTo(0);
        window.history.replaceState(null, "", `/${locale}`);
      }
      return;
    }

    if (document.querySelector(href)) {
      event.preventDefault();
      scrollTo(href, { offset: HEADER_OFFSET });
      window.history.replaceState(null, "", href);
    }
  };

  return <Link href={target} onClick={handleClick} {...props} />;
}
