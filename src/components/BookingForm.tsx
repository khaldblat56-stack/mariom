"use client";

import { Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CountrySelect } from "@/components/CountrySelect";
import { FormSelect } from "@/components/FormSelect";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { OPEN_BOOKING_FORM_EVENT } from "@/lib/booking";
import { formatPhoneWithCountry, getCountryByCode } from "@/lib/countries";

export function BookingForm() {
  const { t, i18n } = useTranslation();
  const { setScrollLocked } = useSmoothScroll();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "setup" | "error">("idle");
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [service, setService] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isArabic = i18n.language.startsWith("ar");
  const selectedCountry = getCountryByCode(countryCode);
  const hasPhoneNumber = phoneNumber.trim().replace(/[\s()-]/g, "").length >= 6;
  const canSubmit = Boolean(selectedCountry) && hasPhoneNumber && submitStatus !== "sending";
  const serviceOptions = [
    { value: "strategy", label: t("contact.form.services.strategy") },
    { value: "brand", label: t("contact.form.services.brand") },
    { value: "audit", label: t("contact.form.services.audit") },
  ];

  useEffect(() => {
    const openForm = () => {
      setSubmitStatus("idle");
      setShowSuccessBadge(false);
      setCountryCode("");
      setPhoneNumber("");
      setService("");
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

    setScrollLocked(true);
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
      setScrollLocked(false);
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
    };
  }, [isBookingOpen, setScrollLocked]);

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

    if (!selectedCountry || !hasPhoneNumber || !service) {
      return;
    }

    setSubmitStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const phone = formatPhoneWithCountry(selectedCountry.dialCode, phoneNumber);
    const selectedService =
      serviceOptions.find((option) => option.value === service)?.label ?? service;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone,
          service: selectedService,
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
      setCountryCode("");
      setPhoneNumber("");
      setService("");
      setSubmitStatus(result?.email?.configured === false ? "setup" : "success");
      setShowSuccessBadge(true);
      setIsBookingOpen(false);
    } catch {
      setSubmitStatus("error");
    }
  }

  return (
    <>
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

              <div
                className="mt-5 grid min-h-0 flex-1 gap-5 overflow-y-auto overscroll-contain px-4 touch-pan-y md:grid-cols-2"
                onWheel={(event) => event.stopPropagation()}
              >
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
                  <div className="flex min-w-0 items-stretch overflow-hidden rounded-2xl border-2 border-brand-dark/10 bg-white transition focus-within:border-brand-cyan">
                    <CountrySelect
                      value={countryCode}
                      onChange={setCountryCode}
                      label={t("contact.form.country")}
                      placeholder={t("contact.form.countryPlaceholder")}
                      searchPlaceholder={t("contact.form.countrySearch")}
                      emptyLabel={t("contact.form.countryEmpty")}
                      isArabic={isArabic}
                    />
                    <input
                      required
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      placeholder={t("contact.form.phonePlaceholder")}
                      className="min-w-0 flex-1 rounded-e-2xl bg-transparent px-3 py-4 text-lg font-medium outline-none"
                    />
                  </div>
                </label>

                <div className="flex min-w-0 flex-col gap-2 font-bold text-brand-dark md:col-span-2">
                  <span>{t("contact.form.service")}</span>
                  <FormSelect
                    name="service"
                    value={service}
                    onChange={setService}
                    options={serviceOptions}
                    label={t("contact.form.service")}
                    placeholder={t("contact.form.servicePlaceholder")}
                    required
                  />
                </div>

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
                  <span className="flex items-center justify-between gap-3">
                    {t("contact.form.challenge")}
                    <span className="text-sm font-medium text-brand-dark/40">{t("contact.form.optional")}</span>
                  </span>
                  <textarea
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
                  disabled={!canSubmit}
                  className="group flex items-center justify-center gap-3 rounded-full bg-brand-cyan px-8 py-5 text-xl font-bold text-white shadow-xl shadow-brand-cyan/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-brand-cyan"
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
    </>
  );
}
