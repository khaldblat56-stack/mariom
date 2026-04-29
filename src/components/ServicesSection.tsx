"use client";

import { Layout, MessageSquare, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const services = [
  {
    icon: MessageSquare,
  },
  {
    icon: Layout,
  },
  {
    icon: TrendingUp,
  },
];

export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-32 bg-brand-cyan/5 rounded-[4rem]">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6 mb-20"
        >
          <h2 className="text-5xl font-bold font-display text-brand-dark">{t("services.title")}</h2>
          <div className="w-24 h-1.5 bg-brand-cyan rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="grid gap-8">
            {services.map((service, index) => (
              <motion.div
                key={`service-${index}`}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-brand-cyan/5 border border-brand-cyan/10 transition-all flex flex-col gap-8 items-start group md:flex-row"
              >
                <div className="bg-brand-cyan/10 p-5 rounded-2xl group-hover:bg-brand-cyan transition-colors shrink-0">
                  <service.icon className="w-10 h-10 text-brand-cyan group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-brand-dark">
                    {index + 1}. {t(`services.items.${index}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{t(`services.items.${index}.desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>

 <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
  className="hidden lg:block relative isolate"
>
  <div className="absolute inset-0 bg-brand-cyan h-[80%] my-auto -rotate-3 rounded-[3rem] -z-10" />
  <Image
    src="/third.png"
    alt={t("services.imageAlt")}
    width={2754}
    height={1536}
    sizes="(min-width: 1024px) 50vw, 100vw"
    className="w-full rounded-[3rem] shadow-2xl relative z-10"
  />
</motion.div>

        </div>
      </div>
    </section>
  );
}
