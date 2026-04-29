"use client";

import { Calendar, Phone } from "lucide-react";
import { motion } from "motion/react";

export function ContactSection() {
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
              شاركوني تفاصيل مشروعكم، <br />
              <span className="text-brand-cyan">والتحديات التي تواجهونها…</span>
            </h2>
            <p className="text-2xl text-brand-dark font-medium opacity-80">
              وسأقوم بالتواصل معكم لنضع معاً أولى خطوات التغيير.
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
              تواصل عبر واتساب
            </motion.button>
            <motion.button
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center justify-center gap-4 bg-brand-dark hover:bg-black text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/30 group"
            >
              <Calendar className="w-8 h-8 group-hover:scale-110 transition-transform text-brand-yellow" />
              نموذج حجز موعد
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
              مريم <span className="text-brand-cyan">|</span> خبيرة نمو
            </div>
            <div className="flex gap-10 text-xl font-bold">
              <a href="#" className="hover:text-brand-cyan transition-colors">
                انستقرام
              </a>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                لينكد إن
              </a>
              <a href="#" className="hover:text-brand-cyan transition-colors">
                إكس
              </a>
            </div>
            <p className="font-medium opacity-60">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
