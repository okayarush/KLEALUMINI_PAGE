import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLE Alumni — Legacy Professional",
  description: "A prestigious digital yearbook celebrating the legacy of KLE alumni.",
  openGraph: {
    title: "KLE Alumni — Legacy Professional",
    description: "A prestigious digital yearbook celebrating the legacy of KLE alumni.",
  },
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
