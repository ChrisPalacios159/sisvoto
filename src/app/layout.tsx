import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema Electoral - Plataforma de Monitoreo Electoral",
  description:
    "Plataforma web administrativa para monitoreo electoral en tiempo real. Gestión de personeros, actas, mesas electorales y resultados.",
  keywords: [
    "Sistema Electoral",
    "Monitoreo Electoral",
    "Perú",
    "Resultados",
    "Actas",
    "Personeros",
  ],
  icons: {
    icon: "/images/k.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}