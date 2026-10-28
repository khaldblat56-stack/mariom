"use client";

import { useTranslation } from "react-i18next";
import { ChatIcon, HeartIcon, LayoutIcon, SearchIcon, SparkIcon, TrendIcon } from "@/components/icons";

/** Order matches services.items. */
const SERVICE_ICONS = [ChatIcon, TrendIcon, SearchIcon, LayoutIcon, HeartIcon, SparkIcon];

type Item = { title: string; desc: string };

export function ServicesSection() {
  const { t } = useTranslation();
  const services = t("services.items", { returnObjects: true }) as unknown as Item[];
  const steps = t("steps.items", { returnObjects: true }) as unknown as Item[];

  return (
    <>
      <section id="services" className="tint t-teal">
        <div className="wrap">
          <div className="sec-head">
            <h2>{t("services.title")}</h2>
          </div>
          <div className="services">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[index] ?? ChatIcon;

              return (
                <div key={index} className="svc">
                  <span className="ico">
                    <Icon />
                  </span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="tint t-teal t-join">
        <div className="wrap">
          <div className="sec-head">
            <h2>{t("steps.title")}</h2>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <div key={index} className="step">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
