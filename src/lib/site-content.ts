/**
 * Language-neutral site data. Text for every entry lives in public/{ar,en}.json under the
 * matching key and index (e.g. HERO_RESULT_CARDS[i] ↔ hero.cards[i]).
 */

export const WHATSAPP_NUMBER = "96891933324";
export const WHATSAPP_DISPLAY = "+968 9193 3324";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/mariam_wajeh/",
  linkedin: "https://www.linkedin.com/in/mariamwajeh/?skipRedirect=true",
  facebook: "https://www.facebook.com/mari.waj",
} as const;

/** Hrefs starting with "/" are pages under /[locale]; "#…" are sections (home page unless present on the current page). */
export const NAV_ITEMS = [
  { key: "about", href: "/about" },
  { key: "results", href: "/results" },
  { key: "services", href: "#services" },
  { key: "approach", href: "#approach" },
  { key: "brands", href: "#brands" },
  { key: "articles", href: "#articles" },
  { key: "faq", href: "#faq" },
] as const;

export const FOOTER_ITEMS = ["about", "results", "services", "articles", "faq"] as const;

export type ResultImage = {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
};

/** Order matches results.items in the translation files. */
export const RESULT_IMAGES: ResultImage[] = [
  { src: "/images/results/store-sales.webp", width: 456, height: 312 },
  { src: "/images/results/paid-social-google.webp", width: 456, height: 312 },
  { src: "/images/results/paid-social-google.webp", width: 456, height: 312, objectPosition: "center 55%" },
  { src: "/images/results/search-console.webp", width: 456, height: 312 },
  { src: "/images/results/national-day-seo.webp", width: 463, height: 327 },
  { src: "/images/results/seo-sales.webp", width: 1124, height: 735 },
];

type Tone = "c1" | "c2" | "c3" | "c4";

export type HeroResultCard = {
  tiles: { tone: Tone; value: string }[];
  bars: { width: number; value: string; highlight?: boolean }[];
  /** Index into RESULT_IMAGES for the "see the screenshot" button. */
  proof: number;
};

export const HERO_RESULT_CARDS: HeroResultCard[] = [
  {
    tiles: [
      { tone: "c1", value: "69.7K" },
      { tone: "c2", value: "897K" },
      { tone: "c3", value: "3.56K" },
      { tone: "c4", value: "12.87" },
    ],
    bars: [
      { width: 7.8, value: "69.7K" },
      { width: 100, value: "897K", highlight: true },
    ],
    proof: 2,
  },
  {
    tiles: [
      { tone: "c1", value: "3.13M" },
      { tone: "c2", value: "9,741" },
      { tone: "c4", value: "+26%" },
    ],
    bars: [
      { width: 79.4, value: "2.49M" },
      { width: 100, value: "3.13M", highlight: true },
    ],
    proof: 0,
  },
  {
    tiles: [
      { tone: "c1", value: "305K" },
      { tone: "c2", value: "1.55M" },
      { tone: "c3", value: "4,734" },
      { tone: "c4", value: "5.06" },
    ],
    bars: [
      { width: 19.7, value: "305K" },
      { width: 100, value: "1.55M", highlight: true },
    ],
    proof: 1,
  },
  {
    tiles: [
      { tone: "c1", value: "207K" },
      { tone: "c2", value: "7.6M" },
      { tone: "c3", value: "2.7%" },
      { tone: "c4", value: "7.5" },
    ],
    bars: [
      { width: 19, value: "39.3K" },
      { width: 100, value: "207K", highlight: true },
    ],
    proof: 3,
  },
  {
    tiles: [
      { tone: "c1", value: "2.98M" },
      { tone: "c2", value: "460K" },
      { tone: "c4", value: "1,689" },
    ],
    bars: [
      { width: 100, value: "2.98M" },
      { width: 15.4, value: "460K", highlight: true },
    ],
    proof: 4,
  },
];

export const HEADLINE_NUMBER = { to: 200, suffix: "+" };

/** Order matches numbers.items. */
export const SIDE_NUMBERS = [
  { to: 13, suffix: "+" },
  { to: 265, suffix: "+" },
  { to: 20, suffix: "+" },
  { to: 91, suffix: "%" },
];

/** Order matches about.nums. */
export const ABOUT_NUMBERS = ["13+", "200+", "265+", "20+"];

/** Order matches brands.items. */
export const BRAND_LOGOS = [
  "/images/brands/al-oun-oud.webp",
  "/images/brands/rumh-al-teeb.webp",
  "/images/brands/machinist.webp",
  "/images/brands/dark-core.webp",
  "/images/brands/mohtarifeen.webp",
  "/images/brands/dar-dinar.webp",
  "/images/brands/kayan-alanfas.webp",
  "/images/brands/nasayem-aloud.webp",
];

/** Order matches testimonials.items. */
export const TESTIMONIAL_LOGOS = ["/images/brands/kayan-alanfas.webp", "/images/brands/nasayem-aloud.webp"];

export const BRAND_DOT_COUNT = 200;

export const PORTRAIT_IMAGE = { src: "/images/mariam-portrait.webp", width: 620, height: 598 };
export const DESK_IMAGE = { src: "/images/mariam-desk.webp", width: 694, height: 426 };

/** Order matches articles.items. */
export const ARTICLES = [
  { slug: "why-ads-dont-sell", cover: "c-teal", withPortrait: true, ctaHref: "#contact" },
  { slug: "seo-sales-without-ads", cover: "c-yellow", withPortrait: false, ctaHref: "/results" },
  { slug: "measure-leads-not-clicks", cover: "c-ink", withPortrait: false, ctaHref: "#contact" },
] as const;

export type ArticleSlug = (typeof ARTICLES)[number]["slug"];

export function getArticleIndex(slug: string) {
  return ARTICLES.findIndex((article) => article.slug === slug);
}
