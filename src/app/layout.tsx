import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Santri Report App",
  description: "Aplikasi internal pengelolaan raport santri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
