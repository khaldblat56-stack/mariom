"use client";

import { useTranslation } from "react-i18next";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { ARTICLES } from "@/lib/site-content";

type ArticleCopy = {
  tag: string;
  title: string;
  body: { type: "p" | "h"; text: string }[];
  end?: { text: string; highlight: string };
  cta: string;
};

export function ArticlePage({ index }: { index: number }) {
  const { t } = useTranslation();
  const { locale } = useI18nControls();
  const isRtl = locale === "ar";
  const article = ARTICLES[index];
  const copy = (t("articles.items", { returnObjects: true }) as unknown as ArticleCopy[])[index];

  if (!article || !copy) {
    return null;
  }

  return (
    <section className="page">
      <div className="wrap">
        <article className="post">
          <SiteLink className="back" href="#articles">
            {isRtl ? "→" : "←"} {t("articles.back")}
          </SiteLink>
          <span className="ptag">{copy.tag}</span>
          <h1>{copy.title}</h1>
          <p className="post-meta">{t("articles.byline")}</p>
          {copy.body.map((block, blockIndex) =>
            block.type === "h" ? <h2 key={blockIndex}>{block.text}</h2> : <p key={blockIndex}>{block.text}</p>,
          )}
          {copy.end ? (
            <p className="post-end">
              {copy.end.text} <b>{copy.end.highlight}</b>
            </p>
          ) : null}
          <SiteLink className="btn btn-teal" href={article.ctaHref}>
            {copy.cta} {isRtl ? "←" : "→"}
          </SiteLink>
        </article>
      </div>
    </section>
  );
}
