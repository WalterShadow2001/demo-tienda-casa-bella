import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreLayout } from "@/components/site/store-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa Bella | Hogar y Decoración",
  description:
    "Muebles, decoración y artículos para el hogar con estilo mexicano y elegancia atemporal. Envíos a todo México.",
  keywords: [
    "decoración",
    "hogar",
    "muebles",
    "Casa Bella",
    "Mexicano",
    "México",
    "interior",
  ],
  authors: [{ name: "Casa Bella" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Casa Bella | Hogar y Decoración",
    description: "Muebles y decoración con elegancia mexicana.",
    siteName: "Casa Bella",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreLayout>{children}</StoreLayout>
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
