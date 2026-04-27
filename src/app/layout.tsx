import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

import NavigationBar from "@/components/layout/NavigationBar";
import TrpcProvider from "@/lib/trpc/Provider";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "CyberSim",
  description: "CyberSim Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-sans bg-background text-foreground flex flex-col min-h-screen">
        <AuthProvider>
          <TrpcProvider>
            <NavigationBar />
            <main className="flex-grow pt-24 pb-8 px-6">
              {children}
            </main>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
