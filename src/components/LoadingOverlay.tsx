"use client";

export function LoadingOverlay({
  isVisible,
  label,
  text,
}: {
  isVisible: boolean;
  label: string;
  text: string;
}) {
  return (
    <div
      aria-live="polite"
      aria-busy={isVisible}
      className={`hero-surface fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden px-4 py-8 transition-all duration-300 motion-reduce:duration-150 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="hero-dot-field pointer-events-none absolute inset-x-0 top-20 h-96 opacity-25" />
      <div className="animate-soft-float-slow pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-brand-cyan/10 blur-[90px]" />
      <div className="animate-soft-float pointer-events-none absolute left-[8%] bottom-20 h-72 w-72 rounded-full bg-brand-yellow/15 blur-[100px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <div className="rounded-full border border-brand-cyan/15 bg-white/82 px-7 py-4 shadow-2xl shadow-brand-dark/10 backdrop-blur-xl md:px-10 md:py-5">
          <p className="text-xl font-bold leading-relaxed text-brand-dark md:text-3xl">{text}</p>
        </div>
        <div className="flex items-center gap-3" aria-label={label}>
          <span className="loading-dot bg-brand-cyan" />
          <span className="loading-dot bg-brand-yellow [animation-delay:150ms]" />
          <span className="loading-dot bg-brand-dark [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
