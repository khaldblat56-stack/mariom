"use client";

import { Calendar, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-32 px-6 bg-brand-yellow relative rounded-t-[4rem]">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-display text-brand-dark leading-tight">
              {t("contact.titleLine1")} <br />
              <span className="text-brand-cyan">{t("contact.titleLine2")}</span>
            </h2>
            <p className="text-2xl text-brand-dark font-medium opacity-80">
              {t("contact.description")}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ staggerChildren: 0.12 }}
            className="grid md:grid-cols-2 gap-8 mt-6"
          >
            <motion.button
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#1DA851] text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/10 group"
            >
              <Phone className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              {t("contact.whatsapp")}
            </motion.button>
            <motion.button
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center justify-center gap-4 bg-brand-dark hover:bg-black text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/30 group"
            >
              <Calendar className="w-8 h-8 group-hover:scale-110 transition-transform text-brand-yellow" />
              {t("contact.booking")}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="pt-24 border-t border-brand-dark/10 flex flex-col md:flex-row justify-between items-center gap-8 text-brand-dark"
          >
            <div className="text-3xl font-bold">
              {t("brand.name")} <span className="text-brand-cyan">|</span> {t("brand.growthExpert")}
            </div>
            <div className="flex gap-10 text-xl font-bold">
              <a href="#" className="hover:text-brand-cyan transition-colors">
                {t("contact.instagram")}
              </a>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                {t("contact.linkedin")}
              </a>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                {t("contact.x")}
              </a>
            </div>
            <p className="font-medium opacity-60">© {new Date().getFullYear()} {t("contact.rights")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
