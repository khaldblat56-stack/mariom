"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  return (
    <section className="hero-surface relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="hero-dot-field pointer-events-none absolute inset-x-0 top-24 h-80 opacity-30" />
      <div className="animate-soft-float-slow pointer-events-none absolute -right-24 top-32 h-80 w-80 rounded-full bg-brand-cyan/10 blur-[90px]" />
      <div className="animate-soft-float pointer-events-none absolute left-[9%] top-44 h-72 w-72 rounded-full bg-brand-yellow/15 blur-[100px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-white via-white/65 via-45% to-transparent blur-md" />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 h-32 bg-brand-cyan/8 blur-[90px]" />

      <div className="main-content relative z-10 mx-auto grid w-full max-w-[1650px] items-center gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col gap-6"
        >
          <div className="pointer-events-none absolute -bottom-8 right-0 h-36 w-full max-w-2xl rounded-full bg-brand-cyan/10 blur-[80px]" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight font-display text-brand-dark">
            مريم <span className="text-brand-cyan">|</span> خبيرة بناء <br />
            الهوية والنمو <span className="text-brand-cyan">المستدام</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
            أرافقكم في رحلة بناء علامات تجارية راسخة وتصميم خطط تسويقية مبنية على الأرقام لتحقيق نتائج ملموسة.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <button
              onClick={scrollToContact}
              className="w-full md:w-fit bg-brand-dark text-white flex items-center justify-center gap-4 px-10 py-5 rounded-full text-xl font-bold hover:bg-brand-cyan transition-all group shadow-xl shadow-brand-dark/20"
            >
              احجز جلستك الاستشارية الآن
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
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
          <div className="relative z-10 w-full max-w-[720px] lg:max-w-[980px] xl:max-w-[1180px]">
            <div className="hero-portrait-glow pointer-events-none absolute inset-x-[-6%] bottom-[-3%] z-0 h-[34%]" />
            <Image
              src="/hero.png"
              alt="مريم - استشارات تسويقية"
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
