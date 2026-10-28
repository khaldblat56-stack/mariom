"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { PORTRAIT_IMAGE } from "@/lib/site-content";

export function PhilosophySection() {
  const { t } = useTranslation();
  const { locale } = useI18nControls();

  return (
    <section id="approach">
      <div className="wrap">
        <div className="teal-band">
          <div>
            <span className="pill">{t("philosophy.pill")}</span>
            <blockquote>
              {t("philosophy.quoteStart")} <span>{t("philosophy.quoteHighlight")}</span> {t("philosophy.quoteEnd")}
            </blockquote>
            <p className="muted">{t("philosophy.desc")}</p>
            <SiteLink className="btn btn-light" href="/about">
              {t("philosophy.cta")} {locale === "ar" ? "←" : "→"}
            </SiteLink>
          </div>
          <figure className="portrait">
            <Image
              src={PORTRAIT_IMAGE.src}
              width={PORTRAIT_IMAGE.width}
              height={PORTRAIT_IMAGE.height}
              alt={t("philosophy.imageAlt")}
              sizes="(max-width: 820px) 340px, 440px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
