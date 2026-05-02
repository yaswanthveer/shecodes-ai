import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AIChatWidget from "@/components/AIChatWidget";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SheCodes.AI | Your Life Operating System",
  description: "AI-powered life companion for health, confidence, and career comeback. Built with IBM watsonx.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
