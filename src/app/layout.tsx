import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Website Monitor & SEO Checker",
    template: "%s - Website Monitor",
  },
  description: "Audit your website in one dashboard. Check SEO, SSL, broken links, performance, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
