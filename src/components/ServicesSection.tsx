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
    <section id="services" className="flex min-h-screen items-center py-32 bg-brand-cyan/5 rounded-[4rem]">
      <div className="site-container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6 mb-20"
        >
          <h2 className="text-5xl font-bold font-display text-brand-dark lg:text-4xl">{t("services.title")}</h2>
          <div className="w-24 h-1.5 bg-brand-cyan rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-stretch">
          <div className="grid gap-8 content-start">
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
                  <h3 className="text-2xl font-bold mb-4 text-brand-dark lg:text-xl">
                    {index + 1}. {t(`services.items.${index}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg lg:text-base">{t(`services.items.${index}.desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
            className="relative isolate flex w-full min-h-[22rem] flex-col justify-center lg:min-h-0 lg:h-full"
          >
            <div className="relative min-h-[22rem] w-full overflow-hidden rounded-[3rem] shadow-2xl lg:h-[82%] lg:min-h-0 lg:max-h-[40rem]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[82%] w-full origin-bottom -rotate-3 rounded-[3rem] bg-brand-cyan lg:h-[70%]" />
              </div>
              <div className="relative z-10 min-h-[22rem] w-full overflow-hidden lg:min-h-0 lg:h-full">
                <Image
                  src="/third.png"
                  alt={t("services.imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
