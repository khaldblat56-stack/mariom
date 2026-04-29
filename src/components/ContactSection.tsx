"use client";

import { Calendar, Phone, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OPEN_BOOKING_FORM_EVENT } from "@/lib/booking";

const WHATSAPP_PHONE_NUMBER = "96891933324";

export function ContactSection() {
  const { t, i18n } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "setup" | "error">("idle");

  useEffect(() => {
    const openForm = () => {
      setSubmitStatus("idle");
      setIsBookingOpen(true);
    };

    window.addEventListener(OPEN_BOOKING_FORM_EVENT, openForm);

    return () => window.removeEventListener(OPEN_BOOKING_FORM_EVENT, openForm);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus("sending");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          service: formData.get("service"),
          project: formData.get("project"),
          challenge: formData.get("challenge"),
          locale: i18n.language,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; email?: { sent?: boolean; configured?: boolean } };

      if (!response.ok || !result.ok) {
        setSubmitStatus("error");
        return;
      }

      event.currentTarget.reset();
      setSubmitStatus(result.email?.sent ? "success" : "setup");
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <section id="contact" className="py-32 bg-brand-yellow relative rounded-t-[4rem]">
      <div className="site-container">
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
            <motion.a
              href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#1DA851] text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/10 group"
            >
              <Phone className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              {t("contact.whatsapp")}
            </motion.a>
            <motion.button
              type="button"
              onClick={() => {
                setSubmitStatus("idle");
                setIsBookingOpen(true);
              }}
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

      <AnimatePresence>
        {isBookingOpen ? (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-brand-dark/70 px-4 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid max-h-[88vh] w-full max-w-3xl gap-5 overflow-y-auto rounded-[2rem] bg-white p-6 text-start shadow-2xl md:grid-cols-2 md:p-8"
            >
              <div className="flex items-center justify-between gap-4 md:col-span-2">
                <h3 className="text-2xl font-bold text-brand-dark">{t("contact.booking")}</h3>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark text-white transition hover:bg-brand-cyan"
                  aria-label={t("contact.form.close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark">
                {t("contact.form.name")}
                <input
                  required
                  name="name"
                  type="text"
                  placeholder={t("contact.form.namePlaceholder")}
                  className="min-w-0 rounded-2xl border-2 border-brand-dark/10 bg-white px-5 py-4 text-lg font-medium outline-none transition focus:border-brand-cyan"
                />
              </label>

              <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark">
                {t("contact.form.phone")}
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder={t("contact.form.phonePlaceholder")}
                  className="min-w-0 rounded-2xl border-2 border-brand-dark/10 bg-white px-5 py-4 text-lg font-medium outline-none transition focus:border-brand-cyan"
                />
              </label>

              <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark md:col-span-2">
                {t("contact.form.service")}
                <select
                  required
                  name="service"
                  defaultValue=""
                  className="min-w-0 rounded-2xl border-2 border-brand-dark/10 bg-white px-5 py-4 text-lg font-medium outline-none transition focus:border-brand-cyan"
                >
                  <option value="" disabled>
                    {t("contact.form.servicePlaceholder")}
                  </option>
                  <option>{t("contact.form.services.strategy")}</option>
                  <option>{t("contact.form.services.brand")}</option>
                  <option>{t("contact.form.services.audit")}</option>
                </select>
              </label>

              <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark md:col-span-2">
                {t("contact.form.project")}
                <input
                  required
                  name="project"
                  type="text"
                  placeholder={t("contact.form.projectPlaceholder")}
                  className="min-w-0 rounded-2xl border-2 border-brand-dark/10 bg-white px-5 py-4 text-lg font-medium outline-none transition focus:border-brand-cyan"
                />
              </label>

              <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark md:col-span-2">
                {t("contact.form.challenge")}
                <textarea
                  required
                  name="challenge"
                  rows={4}
                  placeholder={t("contact.form.challengePlaceholder")}
                  className="min-w-0 resize-none rounded-2xl border-2 border-brand-dark/10 bg-white px-5 py-4 text-lg font-medium outline-none transition focus:border-brand-cyan"
                />
              </label>

              <button
                type="submit"
                disabled={submitStatus === "sending"}
                className="group flex items-center justify-center gap-3 rounded-full bg-brand-cyan px-8 py-5 text-xl font-bold text-white shadow-xl shadow-brand-cyan/20 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70 md:col-span-2"
              >
                {submitStatus === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                <Send className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
              </button>

              {submitStatus !== "idle" && submitStatus !== "sending" ? (
                <p
                  className={`rounded-2xl px-5 py-4 text-center text-base font-bold md:col-span-2 ${
                    submitStatus === "error" ? "bg-red-50 text-red-700" : "bg-brand-cyan/10 text-brand-cyan"
                  }`}
                >
                  {submitStatus === "success"
                    ? t("contact.form.success")
                    : submitStatus === "setup"
                      ? t("contact.form.setupSuccess")
                      : t("contact.form.error")}
                </p>
              ) : null}
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
