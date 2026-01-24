import type { Metadata } from "next";
import { DesignProvider } from "@/context/DesignContext";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "DesignTool | The Future of Creative Automation",
  description: "A premium dashboard for design-centric workflows, built with Next.js and Bun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
        <DesignProvider>
          {children}
        </DesignProvider>
      </body>
    </html>
  );
}
