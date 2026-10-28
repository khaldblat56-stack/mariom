"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { SiteLink } from "@/components/SiteLink";
import { ARTICLES, PORTRAIT_IMAGE } from "@/lib/site-content";

type ArticleCard = { tag: string; cover: string; title: string; excerpt: string };

export function ArticlesSection() {
  const { t } = useTranslation();
  const items = t("articles.items", { returnObjects: true }) as unknown as ArticleCard[];

  return (
    <section id="articles" className="art-sec">
      <div className="wrap">
        <div className="sec-head">
          <h2>{t("articles.title")}</h2>
          <p className="muted">{t("articles.desc")}</p>
        </div>
        <div className="art-grid">
          {ARTICLES.map((article, index) => {
            const copy = items[index];

            return (
              <SiteLink key={article.slug} className="art-card" href={`/articles/${article.slug}`}>
                <span className={`art-cover ${article.cover}${article.withPortrait ? " has-portrait" : ""}`}>
                  <b>{copy?.cover}</b>
                  {article.withPortrait ? (
                    <Image
                      src={PORTRAIT_IMAGE.src}
                      width={PORTRAIT_IMAGE.width}
                      height={PORTRAIT_IMAGE.height}
                      alt=""
                      sizes="220px"
                    />
                  ) : null}
                </span>
                <div className="art-body">
                  <span className="ptag">{copy?.tag}</span>
                  <h3>{copy?.title}</h3>
                  <p>{copy?.excerpt}</p>
                  <span className="art-meta">{t("articles.readTime")}</span>
                </div>
              </SiteLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
