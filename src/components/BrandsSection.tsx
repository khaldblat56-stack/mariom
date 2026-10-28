"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BRAND_DOT_COUNT, BRAND_LOGOS, TESTIMONIAL_LOGOS } from "@/lib/site-content";

const PULSE_INTERVAL_MS = 260;
const PULSE_DURATION_MS = 900;
/** One dot in every ten represents a charity (20 of 200). */
const isCharityDot = (index: number) => index % 10 === 3;

type Testimonial = { quote: string; name: string; role: string };

function DotWall() {
  const { t } = useTranslation();
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dots = dotsRef.current?.children;

    if (!dots || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timeouts = new Set<number>();
    const interval = window.setInterval(() => {
      const dot = dots[Math.floor(Math.random() * dots.length)];
      dot.classList.add("on");
      const timeout = window.setTimeout(() => {
        dot.classList.remove("on");
        timeouts.delete(timeout);
      }, PULSE_DURATION_MS);
      timeouts.add(timeout);
    }, PULSE_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  return (
    <figure className="wall" aria-label={t("brands.wallLabel")}>
      <div className="wall-head">
        <b>+{BRAND_DOT_COUNT}</b>
        <small>{t("brands.wallCaption")}</small>
      </div>
      <div ref={dotsRef} className="dots" aria-hidden="true">
        {Array.from({ length: BRAND_DOT_COUNT }, (_, index) => (
          <i key={index} className={isCharityDot(index) ? "c" : undefined} />
        ))}
      </div>
      <div className="legend">
        <span>{t("brands.legendBrands")}</span>
        <span className="c">{t("brands.legendCharities")}</span>
      </div>
    </figure>
  );
}

export function BrandsSection() {
  const { t } = useTranslation();
  const names = t("brands.items", { returnObjects: true }) as unknown as string[];
  const testimonials = t("testimonials.items", { returnObjects: true }) as unknown as Testimonial[];

  return (
    <>
      <section id="brands" className="tint t-sand">
        <div className="wrap">
          <div className="sec-head">
            <h2>{t("brands.title")}</h2>
          </div>
          <div className="brands">
            <DotWall />
            <div className="logos">
              {BRAND_LOGOS.map((logo, index) => (
                <figure key={logo} className="lg">
                  <Image src={logo} alt={names[index] ?? ""} width={400} height={300} sizes="(max-width: 480px) 30vw, 160px" />
                  <figcaption>{names[index]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="tint t-sand t-join">
        <div className="wrap">
          <div className="sec-head">
            <h2>{t("testimonials.title")}</h2>
          </div>
          <div className="quotes">
            {testimonials.map((item, index) => (
              <figure key={index} className="quote">
                <span className="qm" aria-hidden="true">
                  ”
                </span>
                <p>{item.quote}</p>
                <figcaption>
                  <Image src={TESTIMONIAL_LOGOS[index]} alt="" width={52} height={39} />
                  <span>
                    <b>{item.name}</b>
                    {item.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
