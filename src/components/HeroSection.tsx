"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { openBookingForm } from "@/lib/booking";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="hero-surface relative flex min-h-screen items-center overflow-hidden pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-0">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="hero-dot-field pointer-events-none absolute inset-x-0 top-24 h-80 opacity-30" />
      <div className="animate-soft-float-slow pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-cyan/10 blur-[90px]" />
      <div className="animate-soft-float pointer-events-none absolute left-[9%] top-44 h-72 w-72 rounded-full bg-brand-yellow/15 blur-[100px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-white via-white/65 via-45% to-transparent blur-md" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 h-32 bg-brand-cyan/8 blur-[90px]" />

      <div className="main-content relative z-10 mx-auto grid w-full max-w-[1650px] items-center gap-8 sm:gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center gap-4 text-center sm:gap-5 lg:items-start lg:text-start"
        >
          <div className="pointer-events-none absolute -bottom-8 right-0 h-36 w-full max-w-2xl rounded-full bg-brand-cyan/10 blur-[80px]" />
          <h1 className="max-w-[22rem] font-display text-[2.35rem] font-bold leading-[1.14] text-brand-dark sm:max-w-none sm:text-5xl md:text-6xl lg:leading-tight">
            {t("hero.titleStart")} <span className="text-brand-cyan">|</span> {t("hero.titleMiddle")} <br />
            {t("hero.titleLine")} <span className="text-brand-cyan">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="max-w-[34rem] text-lg font-medium leading-relaxed text-gray-600 sm:text-xl md:text-2xl">
            {t("hero.description")}
          </p>

          <div className="mt-4 flex w-full flex-col gap-6 sm:mt-6 lg:w-auto">
            <button
              type="button"
              onClick={() => {
                openBookingForm();
              }}
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand-dark px-7 py-4 text-lg font-bold text-white shadow-xl shadow-brand-dark/20 transition-all hover:bg-brand-cyan sm:px-9 sm:py-5 sm:text-xl md:w-fit"
            >
              {t("hero.cta")}
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-2 sm:h-6 sm:w-6" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: -5, scale: 0.92, y: 18 }}
          whileInView={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="animate-soft-float-slow absolute -inset-12 bg-brand-cyan/10 rounded-full blur-[110px]" />
          <div className="relative z-10 w-full max-w-[420px] sm:max-w-[620px] lg:max-w-[980px] xl:max-w-[1180px]">
            <div className="hero-portrait-glow pointer-events-none absolute inset-x-[-6%] bottom-[-3%] z-0 h-[34%]" />
            <Image
              src="/hero.png"
              alt={t("hero.imageAlt")}
              width={2754}
              height={1536}
              priority
              sizes="(min-width: 1280px) 1180px, (min-width: 1024px) 980px, 100vw"
              className="hero-portrait-image animate-soft-float relative z-10 w-full drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
