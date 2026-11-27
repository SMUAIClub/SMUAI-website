import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SMUAI",
  description: "SMUAI",
  icons: {
    icon: "/brand/smuai_favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[--site-header-height:80px] md:[--site-header-height:84px]">
      <body suppressHydrationWarning className="overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
