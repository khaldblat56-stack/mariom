"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { HEADLINE_NUMBER, SIDE_NUMBERS } from "@/lib/site-content";

const COUNT_DURATION_MS = 1400;

/** Counts up from 0 with an ease-out curve the first time the number is half visible. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const element = ref.current;

    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frameId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        observer.disconnect();
        let start: number | null = null;

        const tick = (time: number) => {
          start ??= time;
          const progress = Math.min(1, (time - start) / COUNT_DURATION_MS);
          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));

          if (progress < 1) {
            frameId = requestAnimationFrame(tick);
          }
        };

        frameId = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [to]);

  return <span ref={ref}>{value}</span>;
}

export function StatsSection() {
  const { t } = useTranslation();
  const labels = t("numbers.items", { returnObjects: true }) as unknown as string[];

  return (
    <section id="numbers">
      <div className="wrap">
        <div className="nums">
          <div className="hero-num">
            <span className="pill">{t("numbers.pill")}</span>
            <b>
              <CountUp to={HEADLINE_NUMBER.to} />
              {HEADLINE_NUMBER.suffix}
            </b>
            <h3>{t("numbers.heroTitle")}</h3>
            <p>{t("numbers.heroDesc")}</p>
          </div>
          <div className="side-nums">
            {SIDE_NUMBERS.map((item, index) => (
              <div key={index}>
                <b>
                  <CountUp to={item.to} />
                  {item.suffix}
                </b>
                <span>{labels[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
