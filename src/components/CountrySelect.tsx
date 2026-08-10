"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";
import { createPortal } from "react-dom";
import { COUNTRIES, getCountryByCode, type Country } from "@/lib/countries";

function stopScrollPropagation(event: WheelEvent | TouchEvent) {
  event.stopPropagation();
}

type CountrySelectProps = {
  value: string;
  onChange: (code: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyLabel: string;
  isArabic: boolean;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
};

function countryLabel(country: Country, isArabic: boolean) {
  return isArabic ? country.nameAr : country.nameEn;
}

export function CountrySelect({
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  isArabic,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const selected = getCountryByCode(value);

  const filteredCountries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return COUNTRIES;
    }

    return COUNTRIES.filter((country) => {
      const haystack = [country.nameEn, country.nameAr, country.dialCode, country.code]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized) || country.dialCode.includes(normalized);
    });
  }, [query]);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const menuWidth = Math.min(320, window.innerWidth - 24);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < 320 && rect.top > spaceBelow;
      const left = Math.min(
        Math.max(12, isArabic ? rect.right - menuWidth : rect.left),
        window.innerWidth - menuWidth - 12,
      );

      setMenuPosition({
        top: openUpward ? rect.top - 8 : rect.bottom + 8,
        left,
        width: menuWidth,
        openUpward,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, isArabic]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
      setQuery("");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    const frameId = window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectCountry(code: string) {
    onChange(code);
    setIsOpen(false);
    setQuery("");
  }

  const menu =
    typeof document === "undefined"
      ? null
      : createPortal(
          <AnimatePresence>
            {isOpen && menuPosition ? (
              <motion.div
                key="country-menu"
                ref={menuRef}
                id={listId}
                role="listbox"
                aria-label={label}
                initial={{ opacity: 0, y: menuPosition.openUpward ? 8 : -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: menuPosition.openUpward ? 8 : -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: menuPosition.openUpward ? undefined : menuPosition.top,
                  bottom: menuPosition.openUpward
                    ? window.innerHeight - menuPosition.top
                    : undefined,
                  left: menuPosition.left,
                  width: menuPosition.width,
                  zIndex: 1200,
                }}
                onWheel={stopScrollPropagation}
                onTouchMove={stopScrollPropagation}
                className="overflow-hidden rounded-3xl border-2 border-brand-dark/10 bg-white shadow-2xl shadow-brand-dark/20"
              >
                <div className="border-b border-brand-dark/8 p-3">
                  <label className="flex items-center gap-2 rounded-2xl bg-brand-dark/[0.04] px-3 py-2.5">
                    <Search className="h-4 w-4 shrink-0 text-brand-dark/40" />
                    <input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={searchPlaceholder}
                      className="min-w-0 flex-1 bg-transparent text-base font-medium text-brand-dark outline-none placeholder:text-brand-dark/35"
                    />
                  </label>
                </div>

                <ul
                  className="max-h-64 overflow-y-auto overscroll-contain p-2 touch-pan-y"
                  onWheel={stopScrollPropagation}
                >
                  {filteredCountries.length === 0 ? (
                    <li className="px-3 py-6 text-center text-sm font-medium text-brand-dark/45">
                      {emptyLabel}
                    </li>
                  ) : (
                    filteredCountries.map((country) => {
                      const isSelected = country.code === value;

                      return (
                        <li key={country.code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectCountry(country.code)}
                            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start transition ${
                              isSelected
                                ? "bg-brand-cyan/12 text-brand-dark"
                                : "text-brand-dark hover:bg-brand-dark/[0.04]"
                            }`}
                          >
                            <span className="text-xl leading-none" aria-hidden>
                              {country.flag}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-base font-bold">
                              {countryLabel(country, isArabic)}
                            </span>
                            <span dir="ltr" className="shrink-0 text-sm font-semibold text-brand-dark/55">
                              {country.dialCode}
                            </span>
                            {isSelected ? (
                              <Check className="h-4 w-4 shrink-0 text-brand-cyan" />
                            ) : (
                              <span className="h-4 w-4 shrink-0" aria-hidden />
                            )}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        );

  return (
    <div ref={rootRef} className="relative shrink-0 border-e-2 border-brand-dark/10">
      <input type="hidden" name="country" value={value} />
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-full min-h-[3.75rem] items-center gap-1.5 rounded-s-2xl bg-transparent py-4 pe-8 ps-3 text-base font-medium text-brand-dark outline-none transition hover:bg-brand-dark/[0.03]"
      >
        {selected ? (
          <>
            <span className="text-xl leading-none" aria-hidden>
              {selected.flag}
            </span>
            <span dir="ltr">{selected.dialCode}</span>
          </>
        ) : (
          <span className="max-w-[4.5rem] truncate text-sm text-brand-dark/40 sm:max-w-none sm:text-base">
            {placeholder}
          </span>
        )}
        <ChevronDown
          className={`pointer-events-none absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/45 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {menu}
    </div>
  );
}
