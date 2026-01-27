import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const fredoka = Fredoka({
    subsets: ["latin"],
    variable: "--font-fredoka",
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Design Tool",
    description: "Advanced Design Interface",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${fredoka.variable} font-sans antialiased h-screen overflow-hidden bg-neutral-900 text-neutral-300`}>
                {children}
                <Script
                    src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"
                    strategy="beforeInteractive"
                />
            </body>
        </html>
    );
}
