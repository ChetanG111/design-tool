import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
