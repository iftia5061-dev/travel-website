import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Website - Explore The World",
  description: "Discover amazing destinations, unforgettable tours and hassle-free travel services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
