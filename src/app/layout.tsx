import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Web3Context from "@/context/Web3Context";
import { Toaster } from "react-hot-toast";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import wagmiConfig from "@/blockchain/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Staking App",
  description: "Staking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie  '));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3Context initialState={initialState}>
          {children}
          <Toaster />
        </Web3Context>
      </body>
    </html>
  );
}
