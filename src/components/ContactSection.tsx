"use client";

import { Calendar, Phone, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FormEvent, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { OPEN_BOOKING_FORM_EVENT } from "@/lib/booking";

const WHATSAPP_PHONE_NUMBER = "+96891933324";
const SOCIAL_LINKS = [
  {
    labelKey: "contact.instagram",
    href: "https://www.instagram.com/mariam_wajeh/",
    Icon: InstagramIcon,
  },
  {
    labelKey: "contact.linkedin",
    href: "https://www.linkedin.com/in/mariamwajeh/?skipRedirect=true",
    Icon: LinkedinIcon,
  },
  {
    labelKey: "contact.facebook",
    href: "https://www.facebook.com/mari.waj",
    Icon: FacebookIcon,
  },
] as const;

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.98H3.85v10.14h3.09V8.98ZM5.39 4.88a1.78 1.78 0 1 0 0 3.56 1.78 1.78 0 0 0 0-3.56Zm13.76 8.44c0-3.06-1.64-4.48-3.83-4.48a3.3 3.3 0 0 0-2.98 1.64h-.04v-1.5H9.34v10.14h3.09v-5.02c0-1.32.25-2.6 1.89-2.6 1.61 0 1.63 1.51 1.63 2.68v4.94h3.09v-5.8h.11Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.17 8.58V6.92c0-.8.39-1.19 1.25-1.19h1.44V3.12A19.5 19.5 0 0 0 14.76 3c-2.08 0-3.5 1.27-3.5 3.59v1.99H8.91v2.92h2.35V21h2.88v-9.5h2.39l.38-2.92h-2.74Z" />
    </svg>
  );
}

export function ContactSection() {
  const { t, i18n } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "setup" | "error">("idle");
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openForm = () => {
      setSubmitStatus("idle");
      setShowSuccessBadge(false);
      setIsBookingOpen(true);
    };

    window.addEventListener(OPEN_BOOKING_FORM_EVENT, openForm);

    return () => window.removeEventListener(OPEN_BOOKING_FORM_EVENT, openForm);
  }, []);

  useEffect(() => {
    if (!isBookingOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;
    const htmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const frameId = window.requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, [isBookingOpen]);

  useEffect(() => {
    if (!showSuccessBadge) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSuccessBadge(false);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [showSuccessBadge]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

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

      const result = (await response
        .json()
        .catch(() => null)) as { ok?: boolean; email?: { sent?: boolean; configured?: boolean } } | null;

      if (!response.ok || result?.ok === false) {
        setSubmitStatus("error");
        return;
      }

      form.reset();
      setSubmitStatus(result?.email?.configured === false ? "setup" : "success");
      setShowSuccessBadge(true);
      setIsBookingOpen(false);
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <section id="contact" className="flex min-h-screen items-stretch py-32 bg-brand-yellow relative rounded-t-[4rem]">
      <div className="site-container flex">
        <div className="max-w-5xl mx-auto w-full text-center flex flex-col justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-display text-brand-dark leading-tight lg:text-5xl">
              {t("contact.titleLine1")} <br />
              <span className="text-brand-cyan">{t("contact.titleLine2")}</span>
            </h2>
            <p className="text-2xl text-brand-dark font-medium opacity-80 lg:text-xl">
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
              className="flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#1DA851] text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/10 group lg:text-xl"
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
              className="flex items-center justify-center gap-4 bg-brand-dark hover:bg-black text-white py-7 px-10 rounded-[2rem] text-2xl font-bold transition-all shadow-xl shadow-black/30 group lg:text-xl"
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
            {/* <div className="text-3xl font-bold lg:text-2xl">
              {t("brand.name")} <span className="text-brand-cyan">|</span> {t("brand.growthExpert")}
            </div> */}
            <div className="flex flex-wrap justify-center gap-10 text-xl font-bold lg:text-lg">
              {SOCIAL_LINKS.map(({ href, labelKey, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t(labelKey)}
                  title={t(labelKey)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand-dark/15 transition-colors hover:border-brand-cyan hover:bg-white/40 hover:text-brand-cyan"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="font-medium opacity-60">© {new Date().getFullYear()} {t("contact.rights")}</p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessBadge ? (
          <motion.div
            className="fixed bottom-6 left-1/2 z-[1100] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-brand-cyan px-6 py-4 text-center text-base font-bold text-white shadow-2xl shadow-brand-cyan/30"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="status"
          >
            {submitStatus === "setup" ? t("contact.form.setupSuccess") : t("contact.form.success")}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isBookingOpen ? (
          <motion.div
            className="fixed inset-0 z-[1000] flex min-h-0 items-center justify-center overflow-y-auto overscroll-contain bg-brand-dark/70 px-4 py-8 backdrop-blur-sm"
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
              className="flex max-h-[min(88vh,100dvh)] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white p-6 text-start shadow-2xl md:p-8"
            >
              <div className="flex items-center justify-between gap-4">
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

              <div className="mt-5 grid min-h-0 flex-1 gap-5 overflow-y-auto overscroll-contain px-4 touch-pan-y md:grid-cols-2">
                <label className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark">
                  {t("contact.form.name")}
                  <input
                    ref={nameInputRef}
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
              </div>

              <div className="mt-5 grid gap-5">
                <button
                  type="submit"
                  disabled={submitStatus === "sending"}
                  className="group flex items-center justify-center gap-3 rounded-full bg-brand-cyan px-8 py-5 text-xl font-bold text-white shadow-xl shadow-brand-cyan/20 transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
                >
                  {submitStatus === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                  <Send className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                </button>

                {submitStatus !== "idle" && submitStatus !== "sending" ? (
                  <p
                    className={`rounded-2xl px-5 py-4 text-center text-base font-bold ${
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
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
