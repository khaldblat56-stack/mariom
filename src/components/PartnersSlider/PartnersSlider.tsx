"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

const partners = [
  { name: "Partner 1", logo: "/icon's/ea6b2e04-b0aa-473c-adc6-c7ca6b59508a.webp" },
  { name: "Partner 2", logo: "/icon's/logo_13bb765f38abfc2221091295b8ae31e1_2x.webp" },
  { name: "Partner 3", logo: "/icon's/logo-2.webp" },
  { name: "Partner 4", logo: "/icon's/xa5RKxGz60A97r1pXISpSPBlyhrdO4RZNGHcR1Ny.webp" },
  { name: "Partner 5", logo: "/icon's/بروفيل داركور copy.webp" },
  { name: "Partner 6", logo: "/icon's/569202325_18537434119024566_7623761947091725780_n.webp" },
  { name: "Partner 7", logo: "/icon's/465078180_1061240301960585_1519673208909627721_n (1).webp" },
  { name: "Partner 8", logo: "/icon's/420091823_1554543385365252_853350234679416694_n.webp" },
  { name: "Partner 9", logo: "/icon's/344215811_266318392500626_8048074760267000726_n.webp" },
  { name: "Partner 10", logo: "/icon's/311382148_633999991777173_7699344888629203241_n.webp" },
];

export default function PartnersSlider() {
  const { t } = useTranslation();

  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="partners-slider-heading text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-display text-3xl font-bold text-brand-dark md:text-5xl">
            {t("partnersSlider.heading")}
          </h2>
        </div>

        <div className="relative" dir="ltr">
          <div className="overflow-hidden">
            <div className="partners-slider-track flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
              {duplicatedPartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex h-48 w-80 flex-shrink-0 items-center justify-center opacity-70 transition-all duration-300 hover:opacity-100"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={320}
                    height={192}
                    className="max-h-40 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-0 left-0 h-full w-20 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 h-full w-20 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
