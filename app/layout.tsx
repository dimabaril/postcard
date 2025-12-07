import { CardProvider } from "./CardContext";
import type { Metadata } from "next";
// import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// const openSans = Open_Sans({
//   subsets: ["cyrillic", "latin"],
//   display: "swap",
//   variable: "--font-open-sans",
// });

const openSans = localFont({
  src: [
    {
      path: "./_fonts/OpenSans-Regular.ttf",
      weight: "400", // or 'normal'
      style: "normal",
    },
  ],
  variable: "--font-open-sans",
  display: "swap",
});

const openSansCondensed = localFont({
  src: [
    {
      path: "./_fonts/OpenSans_Condensed-Regular.ttf",
      weight: "400", // or 'normal'
      style: "normal",
    },
  ],
  variable: "--font-open-sans-condensed",
  display: "swap",
});

const miroslav = localFont({
  src: [
    {
      path: "./_fonts/MiroslavRegular.ttf",
      weight: "400", // or 'normal'
      style: "normal",
    },
  ],
  variable: "--font-miroslav",
  display: "swap",
});

export const metadata: Metadata = {
  title: "РТУ 30 ЛЕТ",
  description: "Создайте и отправьте открытку к 30-летию РТУ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${openSans.variable} ${openSansCondensed.variable} ${miroslav.variable} bg-[#22386F] antialiased`}
      >
        <CardProvider>
          <main className="min-h-dvh px-6 py-6">{children}</main>
        </CardProvider>
      </body>
    </html>
  );
}
