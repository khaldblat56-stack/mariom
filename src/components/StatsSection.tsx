"use client";

import { BarChart3, BriefcaseBusiness, Handshake, Smile } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const statIcons = [BriefcaseBusiness, Handshake, BarChart3, Smile];

export function StatsSection() {
  const { t } = useTranslation();

  return (
    <section className="relative -mt-8 px-6 pb-28">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="overflow-hidden rounded-[3rem] border border-brand-cyan/10 bg-white shadow-2xl shadow-brand-cyan/10"
        >
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-brand-dark p-10 md:p-12 text-white">
              <span className="text-brand-yellow font-bold tracking-widest uppercase">
                {t("stats.eyebrow")}
              </span>
              <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight font-display md:text-5xl">
                {t("stats.title")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2">
              {statIcons.map((Icon, index) => (
                <motion.div
                  key={`stat-${index}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
                  className="group flex min-h-44 flex-col justify-between gap-6 border-b border-brand-cyan/10 p-8 odd:border-e sm:[&:nth-child(n+3)]:border-b-0"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 transition-colors group-hover:bg-brand-cyan">
                    <Icon className="h-7 w-7 text-brand-cyan transition-colors group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-5xl font-black leading-none text-brand-cyan">{t(`stats.items.${index}.value`)}</p>
                    <p className="mt-3 text-lg font-bold leading-relaxed text-brand-dark/75">{t(`stats.items.${index}.label`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
