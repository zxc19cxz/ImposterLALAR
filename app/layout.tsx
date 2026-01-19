import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/components/GameProvider";

export const metadata: Metadata = {
  title: "Imposter Game",
  description: "A fun party game where players try to find the imposter among them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-full">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
