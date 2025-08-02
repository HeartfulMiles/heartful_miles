import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Happy Miles - Your Dream Vacation Awaits",
  description: "Professional travel planning services. We craft unforgettable travel experiences tailored to your dreams. From exotic destinations to luxury accommodations, we make your travel dreams come true.",
  keywords: "travel planner, vacation planning, luxury travel, custom itineraries, travel agency",
  authors: [{ name: "Happy Miles" }],
  openGraph: {
    title: "Happy Miles - Your Dream Vacation Awaits",
    description: "Professional travel planning services. We craft unforgettable travel experiences tailored to your dreams.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Miles - Your Dream Vacation Awaits",
    description: "Professional travel planning services. We craft unforgettable travel experiences tailored to your dreams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
