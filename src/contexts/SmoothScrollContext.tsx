"use client";

import type Lenis from "@studio-freight/lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface SmoothScrollContextType {
  lenis: Lenis | null;
  setScrollLocked: (locked: boolean) => void;
  scrollTo: (target: string | number, options?: { offset?: number; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  setScrollLocked: () => {},
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function scrollToNative(target: string | number, options?: { offset?: number; duration?: number }) {
  if (typeof target === "string") {
    const el = document.querySelector(target);
    if (!el) {
      return;
    }
    const offset = options?.offset ?? 0;
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    return;
  }

  window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const nativeLockCountRef = useRef(0);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    /** Skip Lenis/GSAP entirely on mobile for lower JS cost and native scrolling. */
    if (isMobile) {
      return;
    }

    const state = {
      cancelled: false,
      rafId: 0,
      instance: null as Lenis | null,
      scrollTrigger: null as typeof import("gsap/ScrollTrigger").ScrollTrigger | null,
    };

    const tearDown = () => {
      cancelAnimationFrame(state.rafId);
      const { instance, scrollTrigger } = state;
      if (instance && scrollTrigger) {
        const st = scrollTrigger;
        instance.off("scroll", st.update);
        st.killAll();
        instance.destroy();
      } else if (instance) {
        instance.destroy();
      }
      state.instance = null;
      state.scrollTrigger = null;
      lenisRef.current = null;
      setLenis(null);
    };

    void (async () => {
      try {
        const [{ default: LenisCtor }, { default: gsap }, stMod] = await Promise.all([
          import("@studio-freight/lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        if (state.cancelled) {
          return;
        }

        const ST = stMod.ScrollTrigger;
        gsap.registerPlugin(ST);

        const instance = new LenisCtor({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        if (state.cancelled) {
          instance.destroy();
          return;
        }

        state.instance = instance;
        state.scrollTrigger = ST;

        lenisRef.current = instance;
        instance.on("scroll", ST.update);

        ST.scrollerProxy(document.body, {
          scrollTop(value) {
            if (arguments.length && typeof value === "number") {
              instance.scrollTo(value);
            }
            return instance.scroll;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
        });

        const tick = (time: number) => {
          if (state.cancelled || !state.instance) {
            return;
          }
          instance.raf(time);
          state.rafId = requestAnimationFrame(tick);
        };

        state.rafId = requestAnimationFrame(tick);
        setLenis(instance);
        ST.refresh();

        if (state.cancelled) {
          tearDown();
        }
      } catch {
        if (!state.cancelled) {
          lenisRef.current = null;
          setLenis(null);
        }
      }
    })();

    return () => {
      state.cancelled = true;
      tearDown();
    };
  }, []);

  const scrollTo = useCallback((target: string | number, options?: { offset?: number; duration?: number }) => {
    const instance = lenisRef.current;

    if (!instance) {
      scrollToNative(target, options);
      return;
    }

    if (typeof target === "string") {
      instance.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration,
      });
    } else {
      instance.scrollTo(target, {
        duration: options?.duration,
      });
    }
  }, []);

  const setScrollLocked = useCallback((locked: boolean) => {
    const instance = lenisRef.current;

    if (instance) {
      if (locked) {
        instance.stop();
      } else {
        instance.start();
      }
      return;
    }

    /** Body scroll lock when Lenis is disabled (e.g. mobile). */
    if (locked) {
      nativeLockCountRef.current += 1;
      if (nativeLockCountRef.current === 1) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }
    } else {
      nativeLockCountRef.current = Math.max(0, nativeLockCountRef.current - 1);
      if (nativeLockCountRef.current === 0) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis, setScrollLocked, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
