import Header from "@/components/header";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Contos Criativos",
  description: "Crie histórias incríveis com a ajuda da inteligência artificial!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen">
        <Header />
        {children}
        <Toaster duration={3000} position="bottom-left" />
      </body>
    </html>
  );
}
