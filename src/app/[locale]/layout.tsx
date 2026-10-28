import localFont from "next/font/local";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/SiteShell";
import { isSupportedLocale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { JsonLd, OG_IMAGE, SITE_URL } from "@/lib/seo";
import { LocaleProviders } from "./LocaleProviders";

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

const seo = {
  ar: {
    title: "مريم وجيه الأعور | مستشار تسويق رقمي وحملات إعلانية ممولة",
    description:
      "مستشارة تسويق رقمي بخبرة 10+ سنوات في إدارة حملات إعلانية ممولة لأكثر من 20 جمعية خيرية ومؤسسة تجارية. متخصصة في ميتا ادز، جوجل ادز والتسويق بالذكاء الاصطناعي.",
    longDescription:
      "مريم وجيه الأعور - مستشارة تسويق رقمي بأكثر من 10 سنوات خبرة عملية بين فلسطين والمملكة العربية السعودية وسلطنة عمان. متخصصة في إدارة الحملات الإعلانية الممولة على نطاق واسع، مع تركيز على القطاع الخيري حيث تدير حاليا حملات لأكثر من 20 جمعية خيرية في منطقة الخليج. خبيرة في منصات ميتا، جوجل ادز، يوتيوب، سناب شات وتيك توك، مع دمج ذكي لأدوات الذكاء الاصطناعي في إنتاج المحتوى الإبداعي وتحسين أداء الحملات.",
    keywords: [
      "مستشار تسويق رقمي",
      "استشارات تسويق",
      "حملات إعلانية ممولة",
      "تسويق رقمي للجمعيات الخيرية",
      "خبير ميتا ادز",
      "إدارة حملات فيسبوك وإنستغرام",
      "تسويق رقمي السعودية",
      "تسويق رقمي عمان",
      "خبير حملات إعلانية الخليج",
      "تسويق بالذكاء الاصطناعي",
      "مدرب تسويق رقمي",
      "مريم وجيه الأعور",
      "مريم وجيه",
    ],
    path: "/ar",
    ogLocale: "ar_SA",
  },
  en: {
    title: "Mariam Wajeh Alawar | Digital Marketing Consultant & Paid Ads Expert",
    description:
      "Digital marketing consultant with 10+ years of experience managing paid ad campaigns for 20+ charities and businesses across the Gulf. Meta Ads, Google Ads & AI-powered marketing.",
    longDescription:
      "Mariam Wajeh Alawar is a Digital Marketing Consultant with over 10 years of hands-on experience across Palestine, Saudi Arabia, and Oman. She specializes in large-scale paid advertising campaigns with a strong focus on the charity and nonprofit sector, currently leading campaigns for 20+ charitable organizations across the Gulf. Mariam works across Meta Ads, Google Ads, YouTube, Snapchat, and TikTok, integrating AI tools to elevate creative production and campaign optimization.",
    keywords: [
      "digital marketing consultant",
      "marketing consultant Oman",
      "paid ads expert",
      "Meta Ads consultant",
      "Google Ads expert",
      "charity marketing consultant",
      "nonprofit marketing Saudi Arabia",
      "AI-powered marketing",
      "Gulf digital marketing",
      "paid social campaigns",
      "marketing trainer",
      "Mariam Wajeh Alawar",
      "Mariam Wajeh",
    ],
    path: "/en",
    ogLocale: "en_US",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {};
  }

  const localeSeo = seo[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: localeSeo.title,
    description: localeSeo.description,
    icons: {
      icon: "/icon.svg",
    },
    keywords: [...localeSeo.keywords],
    alternates: {
      canonical: localeSeo.path,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      title: localeSeo.title,
      description: localeSeo.description,
      url: localeSeo.path,
      siteName: "Mariam Wajeh",
      type: "website",
      locale: localeSeo.ogLocale,
      images: [{ ...OG_IMAGE, alt: locale === "ar" ? "مريم وجيه الأعور" : "Mariam Wajeh Alawar" }],
    },
    twitter: {
      card: "summary_large_image",
      title: localeSeo.title,
      description: localeSeo.description,
      images: [OG_IMAGE.url],
    },
  };
}

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

  const localeSeo = seo[locale];
  const name = locale === "ar" ? "مريم وجيه الأعور" : "Mariam Wajeh Alawar";
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name,
        alternateName: locale === "ar" ? "مريم وجيه" : "Mariam Wajeh",
        url: `${SITE_URL}${localeSeo.path}`,
        image: `${SITE_URL}/images/mariam-desk.webp`,
        jobTitle: locale === "ar" ? "مستشارة تسويق رقمي" : "Digital Marketing Consultant",
        description: localeSeo.longDescription,
        knowsAbout:
          locale === "ar"
            ? ["التسويق الرقمي", "الحملات الإعلانية الممولة", "ميتا ادز", "جوجل ادز", "تحسين محركات البحث", "التسويق بالذكاء الاصطناعي"]
            : ["Digital marketing", "Paid ad campaigns", "Meta Ads", "Google Ads", "SEO", "AI-powered marketing"],
        sameAs: [
          "https://www.facebook.com/mari.waj",
          "https://www.instagram.com/mariam_wajeh/",
          "https://www.linkedin.com/in/mariamwajeh/",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name,
        url: `${SITE_URL}${localeSeo.path}`,
        image: `${SITE_URL}${OG_IMAGE.url}`,
        logo: `${SITE_URL}/images/logo.webp`,
        description: localeSeo.description,
        telephone: "+96891933324",
        areaServed: ["SA", "QA", "OM", "AE", "KW", "BH"],
        founder: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Mariam Wajeh",
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <div className={locale === "ar" ? `${expoArabic.className} locale-font-ar` : undefined}>
      <LocaleProviders locale={locale}>
        <SiteShell>{children}</SiteShell>
      </LocaleProviders>
      <JsonLd data={siteSchema} />
    </div>
  );
}
