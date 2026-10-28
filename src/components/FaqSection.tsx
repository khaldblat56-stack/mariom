"use client";

import { useTranslation } from "react-i18next";

type FaqItem = { q: string; a: string };

export function FaqSection() {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as unknown as FaqItem[];

  return (
    <section id="faq">
      <div className="wrap">
        <div className="sec-head">
          <h2>{t("faq.title")}</h2>
        </div>
        <div className="faq">
          {items.map((item, index) => (
            <details key={index}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
