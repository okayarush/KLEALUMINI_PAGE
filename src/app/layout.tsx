import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KLE Alumni — Legacy Professional",
  description: "A prestigious digital yearbook celebrating the legacy of KLE alumni.",
  icons: {
    icon: '/images/favicon.png',
  },
  openGraph: {
    title: "KLE Alumni — Legacy Professional",
    description: "A prestigious digital yearbook celebrating the legacy of KLE alumni.",
  },
};

const _a = "Arush Talgeri";
const _b = "https://www.linkedin.com/in/arush-talgeri-5bb866320/";
const _c = "ECE \u202725 \u00b7 KLE Technological University";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <img
          src="/images/favicon.png"
          alt="KLE Alumni"
          style={{
            position: 'fixed',
            bottom: 23,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 244,
            height: 244,
            zIndex: 9998,
            objectFit: 'contain',
            opacity: 0.95,
            mixBlendMode: 'screen',
          }}
        />
        {children}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "6px 0 8px",
            fontSize: 11,
            fontFamily: "Inter, sans-serif",
            color: "rgba(232,234,240,0.38)",
            pointerEvents: "none",
            zIndex: 9999,
            letterSpacing: "0.02em",
          }}
        >
          <a
            href={_b}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            Crafted by <span style={{ color: "rgba(201,168,76,0.65)", fontWeight: 500 }}>{_a}</span>
            {" \u00b7 "}{_c}
          </a>
        </div>
      </body>
    </html>
  );
}
