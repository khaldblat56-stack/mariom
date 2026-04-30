import localFont from "next/font/local";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";

const expoArabic = localFont({
  src: [
    {
      path: "../../../public/fonts/ExpoArabic-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/ExpoArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <div className={locale === "ar" ? `${expoArabic.className} locale-font-ar` : undefined}>{children}</div>;
}
