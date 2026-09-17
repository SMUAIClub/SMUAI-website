import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SiteChatbot from "@/components/site-chatbot";
import { Analytics } from "@vercel/analytics/next";

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
        <Navbar />
        <main className="w-full overflow-x-clip pt-[calc(var(--site-header-height)+env(safe-area-inset-top))]">
          {children}
        </main>
        <Footer />
        <SiteChatbot />
        <Analytics />
      </body>
    </html>
  );
}
