import "@fontsource-variable/cairo";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "../index.css";

export const metadata: Metadata = {
  title: "مريم | استشارات",
  description: "استشارات تسويقية لبناء الهوية والنمو المستدام.",
  icons: {
    icon: "/icon.svg",
  },
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
        <Script id="snapchat-pixel"   strategy="lazyOnload">
          {`
            (function(e,t,n){
              if(e.snaptr)return;
              var a=e.snaptr=function(){
                a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)
              };
              a.queue=[];
              var s='script';
              var r=t.createElement(s);
              r.async=!0;
              r.src=n;
              var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);
            })(window,document,'https://sc-static.net/scevent.min.js');

            snaptr('init', 'd36f564f-9a8d-4de8-b70f-e38df209ba59', {});
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      </body>
    </html>
  );
}
