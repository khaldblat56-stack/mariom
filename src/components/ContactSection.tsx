"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, WhatsAppIcon } from "@/components/icons";
import { openBookingForm } from "@/lib/booking";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/site-content";

const COPY_FEEDBACK_MS = 1800;

type Step = { title: string; desc: string };

export function ContactSection() {
  const { t } = useTranslation();
  const steps = t("contact.steps", { returnObjects: true }) as unknown as Step[];
  const numberRef = useRef<HTMLSpanElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }

    const timeout = window.setTimeout(() => setCopyState("idle"), COPY_FEEDBACK_MS);

    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const selectNumber = () => {
    const node = numberRef.current;
    const selection = window.getSelection();

    if (node && selection) {
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    setCopyState("fallback");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`+${WHATSAPP_NUMBER}`);
      setCopyState("copied");
    } catch {
      selectNumber();
    }
  };

  return (
    <section id="contact" className="cta-sec">
      <div className="wrap">
        <div className="cta-grid">
          <div className="cta-main">
            <span className="pill">{t("contact.pill")}</span>
            <h2>
              {t("contact.titleStart")} <span>{t("contact.titleHighlight")}</span>
            </h2>
            <p className="cta-sub">{t("contact.description")}</p>
            <ol className="cta-steps">
              {steps.map((step, index) => (
                <li key={index}>
                  <b>{step.title}</b>
                  <span>{step.desc}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="cta-card">
            <h3>{t("contact.cardTitle")}</h3>
            <a className="btn btn-green" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              {t("contact.whatsapp")}
            </a>
            <div className="cta-num">
              <span ref={numberRef}>{WHATSAPP_DISPLAY}</span>
              <button type="button" onClick={handleCopy}>
                {copyState === "copied"
                  ? t("contact.copied")
                  : copyState === "fallback"
                    ? t("contact.copyFallback")
                    : t("contact.copy")}
              </button>
            </div>
            <button type="button" className="btn btn-dark" onClick={openBookingForm}>
              <CalendarIcon stroke="var(--yellow)" />
              {t("contact.booking")}
            </button>
            <p className="cta-note">{t("contact.note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
