"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function AboutSection() {
  const { t } = useTranslation();
  const eyebrow = t("about.eyebrow");

  return (
    <section id="about" className="relative isolate overflow-hidden bg-white py-24 sm:py-28 lg:py-36">
      <div
        aria-hidden
        className="absolute start-0 top-20 -z-10 h-72 w-72 rounded-full bg-brand-cyan/6 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-16 end-0 -z-10 h-80 w-80 rounded-full bg-brand-yellow/12 blur-3xl"
      />

      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 xl:gap-24">
          <motion.div
            initial={{ opacity: 0, x: 46 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="order-1 mx-auto flex w-full max-w-xl flex-col lg:order-1 lg:mx-0"
          >
            <div className="flex w-full flex-col gap-5">
              {eyebrow ? (
                <span className="text-brand-cyan font-bold tracking-widest uppercase">{eyebrow}</span>
              ) : null}
              <div className="space-y-5">
                <h2 className="font-display text-4xl font-bold text-brand-dark sm:text-5xl lg:text-4xl xl:text-5xl">
                  {t("about.title")}
                </h2>
                <span aria-hidden className="block h-1.5 w-20 rounded-full bg-brand-cyan" />
              </div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ staggerChildren: 0.12 }}
              className="mt-8 space-y-6 text-lg font-medium leading-[2.1] text-brand-dark/70 sm:text-xl lg:text-lg xl:text-xl"
            >
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph1")}
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph2Start")} <span className="font-bold text-brand-cyan">{t("about.company")}</span>{" "}
                {t("about.paragraph2End")}
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph3Start")} <span className="font-bold text-brand-cyan">{t("about.partner")}</span>{" "}
                {t("about.paragraph3End")}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -46 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
            className="relative order-2 mx-auto w-full max-w-4xl lg:order-2"
          >
            <div
              aria-hidden
              className="absolute -inset-x-4 bottom-0 h-2/3 rounded-[2rem] bg-brand-yellow/10 sm:-inset-x-6 lg:-inset-x-8"
            />
            <div
              aria-hidden
              className="absolute -bottom-6 end-8 h-24 w-3/4 rounded-full bg-brand-dark/8 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl shadow-brand-dark/10 sm:rounded-[2.5rem] sm:p-4">
              <div className="overflow-hidden rounded-[1.45rem] bg-brand-yellow/10 sm:rounded-[2rem]">
                <Image
                  src="/second.png"
                  alt={t("about.imageAlt")}
                  width={2754}
                  height={1536}
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="aspect-[16/9] w-full object-cover object-center"
                  priority={false}
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-3 rounded-[1.45rem] ring-1 ring-inset ring-brand-cyan/10 sm:inset-4 sm:rounded-[2rem]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
