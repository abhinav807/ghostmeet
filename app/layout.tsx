import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GhostMeet - AI Meeting Intelligence",
  description:
    "Upload meeting recordings and get AI-powered transcriptions, summaries, action items, and follow-up emails.",
  openGraph: {
    title: "GhostMeet - AI Meeting Intelligence",
    description:
      "Turn meetings into action. AI transcribes, summarizes, and extracts insights from your recordings.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
