import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";

export const metadata: Metadata = {
  title: "مريم | استشارات",
  description: "استشارات تسويقية لبناء الهوية والنمو المستدام.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="scrollbar">
        {children}
      </body>
    </html>
  );
}
