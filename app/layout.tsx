import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiceOS — Mini ERP for Service Businesses",
  description: "A bilingual, responsive Mini ERP demo for quotes, projects, invoices, revisions, and auditable operations.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "ServiceOS — Mini ERP for Service Businesses",
    description: "Quote, project, billing, revision, and audit operations in one bilingual workspace.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "ServiceOS shown across desktop, tablet, and mobile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ServiceOS — Mini ERP for Service Businesses",
    description: "A bilingual Mini ERP portfolio demo for service teams.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
