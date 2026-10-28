"use client";

import { type KeyboardEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { SiteLink } from "@/components/SiteLink";
import { useI18nControls } from "@/lib/i18n/I18nProvider";
import { getLocaleDirection } from "@/lib/i18n/config";
import { HERO_RESULT_CARDS, RESULT_IMAGES } from "@/lib/site-content";

const AUTOPLAY_MS = 4200;
const SWIPE_THRESHOLD_PX = 40;

type HeroCardCopy = { title: string; tiles: string[]; bars: string[]; badge: string };

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroSection() {
  const { t } = useTranslation();
  const { locale } = useI18nControls();
  const dir = getLocaleDirection(locale);
  const isRtl = dir === "rtl";
  /** In RTL the next card sits to the left, so swipes and arrow keys are mirrored. */
  const forward = isRtl ? 1 : -1;

  const cards = t("hero.cards", { returnObjects: true }) as unknown as HeroCardCopy[];
  const proofAlts = (t("results.items", { returnObjects: true }) as unknown as { alt: string }[]).map((item) => item.alt);
  const count = HERO_RESULT_CARDS.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(170);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  const go = useCallback((index: number) => setCurrent(((index % count) + count) % count), [count]);
  const stopAutoplay = useCallback(() => setIsAutoplay(false), []);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const measure = () => setStep(Math.min(170, stage.clientWidth * 0.2));
    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!isAutoplay || prefersReducedMotion()) {
      return;
    }

    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % count), AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, isAutoplay]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerUp = (event: globalThis.PointerEvent) => {
      const startX = dragStartX.current;
      dragStartX.current = null;
      setIsDragging(false);

      if (startX === null) {
        return;
      }

      const dx = event.clientX - startX;

      if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
        setCurrent((value) => (((value + (dx > 0 ? forward : -forward)) % count) + count) % count);
        stopAutoplay();
      }
    };

    window.addEventListener("pointerup", handlePointerUp);

    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [count, forward, isDragging, stopAutoplay]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      go(current + forward);
      stopAutoplay();
    } else if (event.key === "ArrowRight") {
      go(current - forward);
      stopAutoplay();
    }
  };

  const openProof = (proof: number) => {
    const image = RESULT_IMAGES[proof];
    setLightboxImage({ src: image.src, alt: proofAlts[proof] ?? "" });
    stopAutoplay();
  };

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-text">
          <span className="pill">{t("hero.pill")}</span>
          <h1>
            {t("hero.titleStart")} <em>{t("hero.titleHighlight")}</em>
          </h1>
          <p className="lead">{t("hero.lead")}</p>
        </div>

        <div
          ref={stageRef}
          className={`stage${isDragging ? " drag" : ""}`}
          aria-roledescription="carousel"
          aria-label={t("hero.carouselLabel")}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          onMouseEnter={stopAutoplay}
        >
          {HERO_RESULT_CARDS.map((card, index) => {
            const copy = cards[index];
            let offset = index - current;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const distance = Math.abs(offset);
            const isActive = distance === 0;

            return (
              <article
                key={index}
                className="rc"
                dir={dir}
                aria-label={copy?.title}
                aria-hidden={!isActive}
                style={{
                  transform: `translateX(${-offset * forward * step}px) scale(${1 - distance * 0.13})`,
                  zIndex: 10 - distance,
                  filter: isActive ? "none" : `blur(${distance * 1.6}px)`,
                  opacity: distance > 2 ? 0 : isActive ? 1 : 0.75,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <header>
                  <span>{copy?.title}</span>
                  <i />
                  <i />
                </header>
                <div className={`tiles${card.tiles.length === 3 ? " t3" : ""}`}>
                  {card.tiles.map((tile, tileIndex) => (
                    <div key={tileIndex} className={`tile ${tile.tone}`}>
                      <small>{copy?.tiles[tileIndex]}</small>
                      <b>{tile.value}</b>
                    </div>
                  ))}
                </div>
                <div className="cmp">
                  {card.bars.map((bar, barIndex) => (
                    <div key={barIndex}>
                      <span>{copy?.bars[barIndex]}</span>
                      <p className="bar">
                        <i className={bar.highlight ? "hi" : undefined} style={{ width: `${bar.width}%` }} />
                      </p>
                      <em>{bar.value}</em>
                    </div>
                  ))}
                </div>
                <footer>
                  <span className="up">{copy?.badge}</span>
                  <button
                    type="button"
                    className="see"
                    tabIndex={isActive ? 0 : -1}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => openProof(card.proof)}
                  >
                    {t("hero.seeShot")}
                  </button>
                </footer>
              </article>
            );
          })}
        </div>

        <div className="ctrl">
          <button
            type="button"
            className="arrow"
            aria-label={t("hero.prev")}
            onClick={() => {
              go(current - 1);
              stopAutoplay();
            }}
          >
            {isRtl ? "→" : "←"}
          </button>
          <div className="cdots">
            {HERO_RESULT_CARDS.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t("hero.slide", { n: index + 1 })}
                aria-current={index === current}
                onClick={() => {
                  go(index);
                  stopAutoplay();
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="arrow"
            aria-label={t("hero.next")}
            onClick={() => {
              go(current + 1);
              stopAutoplay();
            }}
          >
            {isRtl ? "←" : "→"}
          </button>
        </div>
        <p className="hint">{t("hero.hint")}</p>
        <div className="allres">
          <SiteLink className="btn btn-light" href="/results">
            {t("hero.allResults")} {isRtl ? "←" : "→"}
          </SiteLink>
        </div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
}
