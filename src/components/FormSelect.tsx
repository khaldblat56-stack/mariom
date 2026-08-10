"use client";

import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type TouchEvent, type WheelEvent } from "react";
import { createPortal } from "react-dom";

export type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  label: string;
  placeholder: string;
  required?: boolean;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
};

function stopScrollPropagation(event: WheelEvent | TouchEvent) {
  event.stopPropagation();
}

export function FormSelect({
  name,
  value,
  onChange,
  options,
  label,
  placeholder,
  required = false,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const menuWidth = Math.min(rect.width, window.innerWidth - 24);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < 240 && rect.top > spaceBelow;
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - menuWidth - 12);

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
  }, [isOpen]);

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
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectOption(nextValue: string) {
    onChange(nextValue);
    setIsOpen(false);
  }

  const menu =
    typeof document === "undefined"
      ? null
      : createPortal(
          <AnimatePresence>
            {isOpen && menuPosition ? (
              <motion.div
                key={`${name}-menu`}
                ref={menuRef}
                id={listId}
                role="listbox"
                aria-label={label}
                initial={{ opacity: 0, y: menuPosition.openUpward ? 8 : -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: menuPosition.openUpward ? 8 : -8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                onWheel={stopScrollPropagation}
                onTouchMove={stopScrollPropagation}
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
                className="overflow-hidden rounded-3xl border-2 border-brand-dark/10 bg-white shadow-2xl shadow-brand-dark/20"
              >
                <ul
                  className="max-h-64 overflow-y-auto overscroll-contain p-2 touch-pan-y"
                  onWheel={stopScrollPropagation}
                >
                  {options.map((option) => {
                    const isSelected = option.value === value;

                    return (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => selectOption(option.value)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start text-base font-bold transition ${
                            isSelected
                              ? "bg-brand-cyan/12 text-brand-dark"
                              : "text-brand-dark hover:bg-brand-dark/[0.04]"
                          }`}
                        >
                          <span className="min-w-0 flex-1">{option.label}</span>
                          {isSelected ? (
                            <Check className="h-4 w-4 shrink-0 text-brand-cyan" />
                          ) : (
                            <span className="h-4 w-4 shrink-0" aria-hidden />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        );

  return (
    <div ref={rootRef} className="relative min-w-0">
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-white px-5 py-4 text-lg font-medium outline-none transition ${
          isOpen ? "border-brand-cyan" : "border-brand-dark/10 hover:border-brand-dark/20"
        }`}
      >
        <span className={`min-w-0 truncate text-start ${selected ? "text-brand-dark" : "text-brand-dark/40"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-dark/45 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {menu}
    </div>
  );
}
