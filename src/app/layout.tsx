import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Serif calida para titulos y marca: aporta un tono mas humano y menos tecnico.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ATRIA Inmobiliaria",
  description: "Administracion de patrimonios, propiedades y cierres mensuales.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${fraunces.variable}`} lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
