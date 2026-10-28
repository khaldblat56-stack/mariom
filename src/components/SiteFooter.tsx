"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/icons";
import { SiteLink } from "@/components/SiteLink";
import { FOOTER_ITEMS, NAV_ITEMS, SOCIAL_LINKS } from "@/lib/site-content";

const SOCIALS = [
  { key: "instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon },
  { key: "linkedin", href: SOCIAL_LINKS.linkedin, Icon: LinkedinIcon },
  { key: "facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon },
] as const;

export function SiteFooter() {
  const { t } = useTranslation();
  const links = NAV_ITEMS.filter((item) => (FOOTER_ITEMS as readonly string[]).includes(item.key));

  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <SiteLink className="logo" href="#top" aria-label={t("brand.name")}>
              <Image src="/images/logo.webp" alt="" width={64} height={64} />
            </SiteLink>
            <p>{t("brand.tagline")}</p>
          </div>
          <nav className="foot-links" aria-label={t("footer.linksLabel")}>
            {links.map((item) => (
              <SiteLink key={item.key} href={item.href}>
                {t(`nav.${item.key}`)}
              </SiteLink>
            ))}
          </nav>
          <div className="social">
            {SOCIALS.map(({ key, href, Icon }) => (
              <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={t(`contact.${key}`)}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
        </div>
      </div>
    </footer>
  );
}
