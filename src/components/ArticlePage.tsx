"use client";

import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { getArticleMeta } from "@/lib/site-content";

type TimelineStep = { title: string; dates: string; points: string[]; active?: boolean };

/** Text fields accept `**bold**` inline markup. */
type ArticleBlock =
  | { type: "p" | "lead" | "h" | "h3" | "note"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "timeline"; title: string; items: TimelineStep[] };

type ArticleCopy = {
  tag: string;
  title: string;
  date?: string;
  readTime?: string;
  body: ArticleBlock[];
  end?: { text: string; highlight: string };
  sources?: string[];
  cta: string;
};

function renderInline(text: string): ReactNode {
  return text.split("**").map((part, index) => (index % 2 === 1 ? <b key={index}>{part}</b> : part));
}

function renderBlock(block: ArticleBlock, key: number) {
  switch (block.type) {
    case "h":
      return <h2 key={key}>{block.text}</h2>;
    case "h3":
      return <h3 key={key}>{block.text}</h3>;
    case "lead":
      return (
        <p key={key} className="post-lead">
          {renderInline(block.text)}
        </p>
      );
    case "note":
      return (
        <p key={key} className="post-note">
          {renderInline(block.text)}
        </p>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List key={key} className="post-list">
          {block.items.map((item, index) => (
            <li key={index}>{renderInline(item)}</li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div key={key} className="post-table">
          <table>
            <thead>
              <tr>
                {block.head.map((cell, index) => (
                  <th key={index} scope="col">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} scope="row">
                        {renderInline(cell)}
                      </th>
                    ) : (
                      <td key={index}>{renderInline(cell)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "timeline":
      return (
        <figure key={key} className="post-timeline">
          <figcaption>{block.title}</figcaption>
          <ol>
            {block.items.map((step, index) => (
              <li key={index} className={step.active ? "is-active" : undefined}>
                <b>{step.title}</b>
                <span className="post-timeline-dates">{step.dates}</span>
                <ul>
                  {step.points.map((point, pointIndex) => (
                    <li key={pointIndex}>{renderInline(point)}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </figure>
      );
    default:
      return <p key={key}>{renderInline(block.text)}</p>;
  }
}

export function ArticlePage({ index }: { index: number }) {
  const { t } = useTranslation();
  const { locale } = useI18nControls();
  const isRtl = locale === "ar";
  const article = getArticleMeta(index);
  const copy = (t("articles.items", { returnObjects: true }) as unknown as ArticleCopy[])[index];

  if (!article || !copy) {
    return null;
  }

  const meta = [t("articles.author"), copy.date, copy.readTime ?? t("articles.readTime")].filter(Boolean);
  const sources = (copy.sources ?? [])
    .map((label, sourceIndex) => ({ label, url: article.sources?.[sourceIndex] }))
    .filter((source) => source.url);

  return (
    <section className="page">
      <div className="wrap">
        <article className="post">
          <SiteLink className="back" href="#articles">
            {isRtl ? "→" : "←"} {t("articles.back")}
          </SiteLink>
          <span className="ptag">{copy.tag}</span>
          <h1>{copy.title}</h1>
          <p className="post-meta">
            {meta.map((part, partIndex) => (
              <Fragment key={partIndex}>
                {partIndex > 0 ? " · " : null}
                {part === copy.date && article.datePublished ? <time dateTime={article.datePublished}>{part}</time> : part}
              </Fragment>
            ))}
          </p>
          {article.image ? (
            <Image
              className="post-cover"
              src={article.image.src}
              width={article.image.width}
              height={article.image.height}
              alt=""
              sizes="(max-width: 760px) 100vw, 720px"
              priority
            />
          ) : null}
          {copy.body.map(renderBlock)}
          {copy.end ? (
            <p className="post-end">
              {copy.end.text} <b>{copy.end.highlight}</b>
            </p>
          ) : null}
          <SiteLink className="btn btn-teal" href={article.ctaHref}>
            {copy.cta} {isRtl ? "←" : "→"}
          </SiteLink>
          {sources.length > 0 ? (
            <aside className="post-sources">
              <h2>{t("articles.sources")}</h2>
              <ol>
                {sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </article>
      </div>
    </section>
  );
}
