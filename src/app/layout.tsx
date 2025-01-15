import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import RootLayoutClient from "@/app/layout.client";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Hookylog",
  description: "Manage business with ease",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${GeistSans.variable}`}>
      <body>
        <RootLayoutClient />
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
