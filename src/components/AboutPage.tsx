"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { BarsIcon, HeartIcon, TargetIcon } from "@/components/icons";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { ABOUT_NUMBERS, DESK_IMAGE } from "@/lib/site-content";

/** Order matches about.why. */
const WHY_ICONS = [TargetIcon, BarsIcon, HeartIcon];

type StoryItem = { lead: string; text: string; highlight?: string };
type Item = { title: string; desc: string };
type Milestone = Item & { year: string };

export function AboutPage() {
  const { t } = useTranslation();
  const { locale } = useI18nControls();
  const isRtl = locale === "ar";
  const story = t("about.story", { returnObjects: true }) as unknown as StoryItem[];
  const numberLabels = t("about.nums", { returnObjects: true }) as unknown as string[];
  const why = t("about.why", { returnObjects: true }) as unknown as Item[];
  const platforms = t("about.platforms", { returnObjects: true }) as unknown as string[];
  const markets = t("about.markets", { returnObjects: true }) as unknown as string[];
  const timeline = t("about.timeline", { returnObjects: true }) as unknown as Milestone[];

  return (
    <section className="page">
      <div className="wrap">
        <SiteLink className="back" href="#top">
          {isRtl ? "→" : "←"} {t("about.back")}
        </SiteLink>

        <div className="ab-hero">
          <div>
            <span className="pill">{t("about.pill")}</span>
            <h1>{t("about.title")}</h1>
            <p className="lead">{t("about.lead")}</p>
          </div>
          <figure className="avatar">
            <Image
              src={DESK_IMAGE.src}
              width={DESK_IMAGE.width}
              height={DESK_IMAGE.height}
              alt={t("about.imageAlt")}
              sizes="(max-width: 900px) 440px, 500px"
              priority
            />
          </figure>
        </div>

        <div className="ab-grid">
          <div className="ab-card ab-story">
            <h2>{t("about.storyTitle")}</h2>
            {story.map((item, index) => (
              <p key={index}>
                <strong>{item.lead}</strong> {item.text}
                {item.highlight ? (
                  <>
                    {" "}
                    <b>{item.highlight}</b>
                  </>
                ) : null}
              </p>
            ))}
          </div>
          <div className="ab-card ab-nums">
            {ABOUT_NUMBERS.map((value, index) => (
              <div key={index}>
                <b>{value}</b>
                <span>{numberLabels[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sec-head ab-section-head">
          <h2>{t("about.whyTitle")}</h2>
        </div>
        <div className="ab-why">
          {why.map((item, index) => {
            const Icon = WHY_ICONS[index] ?? TargetIcon;

            return (
              <div key={index} className="ab-card">
                <span className="ico">
                  <Icon />
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="ab-two">
          <div className="ab-card">
            <h3>{t("about.platformsTitle")}</h3>
            <div className="chips">
              {platforms.map((platform) => (
                <span key={platform}>{platform}</span>
              ))}
            </div>
          </div>
          <div className="ab-card">
            <h3>{t("about.marketsTitle")}</h3>
            <div className="chips">
              {markets.map((market) => (
                <span key={market}>{market}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="sec-head ab-section-head">
          <h2>{t("about.timelineTitle")}</h2>
        </div>
        <ol className="tl">
          {timeline.map((item, index) => (
            <li key={index} className={index === timeline.length - 1 ? "now" : undefined}>
              <span className="yr">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>

        <div className="allres ab-section-head">
          <SiteLink className="btn btn-teal" href="/results">
            {t("about.cta")} {isRtl ? "←" : "→"}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}
