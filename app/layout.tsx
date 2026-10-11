import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProvider from "@/utils/AppProvider";
import "./globals.css";
import { LiveActivityPopup } from "@/components/LiveActivityPopup";
import { FormillaChat } from "@/components/FormillaChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vicbits Capitals | Future of Investment & Finance",
    template: "%s | Vicbits Capitals",
  },
  description: "An Investment Platform for the Future of Finance",
  keywords: ["Investment", "Crypto", "Capitals", "Finance", "Vicbits"],
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-50">
        <AppProvider>{children}</AppProvider>

        <LiveActivityPopup />
         <FormillaChat />
      </body>
    </html>
  );
}