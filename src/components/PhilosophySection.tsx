"use client";

import { Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function PhilosophySection() {
  const { t } = useTranslation();

  return (
    <section id="philosophy" className="py-40 bg-white overflow-hidden">
      <div className="site-container">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold font-display text-brand-dark mb-6">{t("philosophy.title")}</h2>
            <h3 className="text-3xl text-brand-cyan font-bold">{t("philosophy.subtitle")}</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="bg-brand-dark p-12 md:p-20 rounded-[4rem] text-white relative shadow-2xl"
          >
            <div className="absolute top-0 left-12 w-24 h-24 bg-brand-yellow/20 rounded-b-full" />
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="text-2xl md:text-3xl leading-relaxed font-medium mb-16"
            >
              {t("philosophy.body")}
            </motion.p>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.18 }}
                className="flex flex-col gap-4 p-8 bg-white/5 rounded-3xl border border-white/10"
              >
                <div className="bg-brand-cyan w-12 h-12 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-brand-yellow">{t("philosophy.problemTitle")}</h4>
                <p className="text-xl text-gray-300">{t("philosophy.problemBody")}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
                className="flex flex-col gap-4 p-8 bg-white/5 rounded-3xl border border-white/10"
              >
                <div className="bg-brand-yellow w-12 h-12 rounded-xl flex items-center justify-center">
                  <Zap className="w-7 h-7 text-brand-dark" />
                </div>
                <h4 className="text-2xl font-bold text-brand-yellow">{t("philosophy.opportunityTitle")}</h4>
                <p className="text-xl text-gray-300">{t("philosophy.opportunityBody")}</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.36 }}
              className="mt-16 text-center"
            >
              <p className="text-2xl font-bold text-brand-cyan bg-brand-cyan/10 inline-block px-10 py-4 rounded-full">
                {t("philosophy.closing")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
