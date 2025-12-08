import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Careers at TradeStation | Join Our Team",
    template: "%s | TradeStation Careers",
  },
  description: "Explore career opportunities at TradeStation. We're traders building for traders. Join us in our mission to level the playing field for every trader.",
  keywords: ["TradeStation", "careers", "jobs", "trading", "fintech", "brokerage", "technology jobs", "finance careers"],
  authors: [{ name: "TradeStation" }],
  creator: "TradeStation",
  publisher: "TradeStation",
  metadataBase: new URL("https://careers.tradestation.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TradeStation Careers",
    title: "Careers at TradeStation | Join Our Team",
    description: "Explore career opportunities at TradeStation. We're traders building for traders. Join us in our mission to level the playing field for every trader.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradestation",
    creator: "@tradestation",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
