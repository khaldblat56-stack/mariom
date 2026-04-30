"use client";

import { BarChart3, BriefcaseBusiness, Handshake, Smile } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const statIcons = [BriefcaseBusiness, Handshake, BarChart3, Smile];

function CounterValue({ value, start }: { value: string; start: boolean }) {
  const { prefix, target, suffix } = useMemo(() => {
    const match = value.match(/^(\D*)(\d+)(\D*)$/);

    if (!match) {
      return { prefix: "", target: 0, suffix: value };
    }

    return {
      prefix: match[1],
      target: Number(match[2]),
      suffix: match[3],
    };
  }, [value]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    let frame = 0;
    const duration = 1300;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return (
    <span>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const { t } = useTranslation();
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <section className="relative -mt-8 px-6 pb-28">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          onViewportEnter={() => setHasEntered(true)}
          className="overflow-hidden rounded-[3rem] border border-brand-cyan/10 bg-white p-8 shadow-2xl shadow-brand-cyan/10 md:p-12"
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="inline-flex rounded-full bg-brand-dark px-6 py-3">
              <span className="text-brand-yellow font-bold tracking-widest uppercase">
                {t("stats.eyebrow")}
              </span>
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-tight font-display text-brand-dark md:text-5xl">
              {t("stats.title")}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statIcons.map((Icon, index) => (
              <motion.div
                key={`stat-${index}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
                className="group flex min-h-52 flex-col justify-between gap-8 rounded-[2rem] border border-brand-cyan/10 bg-brand-cyan/5 p-8 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-brand-cyan/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-cyan shadow-sm transition-colors group-hover:bg-brand-cyan group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-5xl font-black leading-none text-brand-cyan">
                    <CounterValue value={t(`stats.items.${index}.value`)} start={hasEntered} />
                  </p>
                  <p className="mt-3 text-lg font-bold leading-relaxed text-brand-dark/75">
                    {t(`stats.items.${index}.label`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
