"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="flex min-h-screen items-center py-32 bg-white relative overflow-hidden">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-brand-yellow/10 rounded-[3rem] transform translate-x-4 translate-y-4" />
            <Image
              src="/second.png"
              alt={t("about.imageAlt")}
              width={2754}
              height={1536}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full rounded-[3rem] shadow-2xl relative z-10 object-cover border-8 border-white"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
            className="flex flex-col gap-8 order-1 lg:order-2"
          >
            <div className="flex flex-col gap-2">
              <span className="text-brand-cyan font-bold tracking-widest uppercase">{t("about.eyebrow")}</span>
              <h2 className="text-5xl font-bold font-display text-brand-dark lg:text-4xl">{t("about.title")}</h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ staggerChildren: 0.12 }}
              className="space-y-6 text-xl leading-relaxed text-gray-700 font-medium lg:text-lg"
            >
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph1")}
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph2Start")} <span className="text-brand-cyan">{t("about.company")}</span>{" "}
                {t("about.paragraph2End")}
              </motion.p>
              <motion.p variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                {t("about.paragraph3Start")} <span className="text-brand-cyan">{t("about.partner")}</span>{" "}
                {t("about.paragraph3End")}
              </motion.p>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                className="bg-brand-dark text-white p-8 rounded-3xl border-r-8 border-brand-yellow"
              >
                {t("about.highlight")}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
