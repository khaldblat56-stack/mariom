"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

export type LightboxImage = { src: string; alt: string };

export function Lightbox({ image, onClose }: { image: LightboxImage | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { setScrollLocked } = useSmoothScroll();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || !image) {
      return;
    }

    dialog.showModal();
    setScrollLocked(true);

    return () => {
      setScrollLocked(false);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [image, setScrollLocked]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={t("results.lightbox")}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {image ? (
        <>
          <button type="button" className="lightbox-close" onClick={onClose} aria-label={t("results.close")}>
            ✕
          </button>
          <img src={image.src} alt={image.alt} />
        </>
      ) : null}
    </dialog>
  );
}
