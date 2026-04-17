import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SubEnergy — Solar Energy on Solana",
  description: "Turn every kilowatt-hour into verifiable on-chain proof. Powered by Solana.",
  openGraph: {
    title: "SubEnergy — Solar Energy on Solana",
    description: "Turn every kilowatt-hour into verifiable on-chain proof.",
    siteName: "SubEnergy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased noise">
        <SolanaProviders>{children}</SolanaProviders>
      </body>
    </html>
  );
}
