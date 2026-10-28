"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { RESULT_IMAGES } from "@/lib/site-content";

type ResultItem = { tag: string; value: string; desc: string; alt: string };

export function ResultsPage() {
  const { t } = useTranslation();
  const { locale } = useI18nControls();
  const items = t("results.items", { returnObjects: true }) as unknown as ResultItem[];
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  return (
    <section className="page">
      <div className="wrap">
        <SiteLink className="back" href="#top">
          {locale === "ar" ? "→" : "←"} {t("results.back")}
        </SiteLink>
        <div className="sec-head">
          <h1>{t("results.title")}</h1>
          <p className="muted">{t("results.desc")}</p>
        </div>
        <div className="proof">
          {RESULT_IMAGES.map((image, index) => {
            const item = items[index];

            return (
              <article key={index} className="pcard">
                <button
                  type="button"
                  className="shot"
                  aria-label={t("results.zoom", { label: item?.alt })}
                  onClick={() => setLightboxImage({ src: image.src, alt: item?.alt ?? "" })}
                >
                  <Image
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt={item?.alt ?? ""}
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 380px"
                    style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
                  />
                </button>
                <div className="pbody">
                  <span className="ptag">{item?.tag}</span>
                  <b>{item?.value}</b>
                  <p>{item?.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
