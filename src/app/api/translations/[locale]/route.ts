import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isSupportedLocale } from "@/lib/i18n/config";

type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { locale } = await context.params;

  if (!isSupportedLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 404 });
  }

  try {
    const translationPath = path.join(process.cwd(), "public", `${locale}.json`);
    const translations = await readFile(translationPath, "utf8");

    return new NextResponse(translations, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json({ error: "Translations not found" }, { status: 404 });
  }
}
