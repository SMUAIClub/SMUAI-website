import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SiteChatbot from "@/components/site-chatbot";

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
    <html lang="en">
      <body suppressHydrationWarning className="overflow-x-hidden">
        <Navbar />
        <main className="w-full overflow-x-hidden pt-[calc(72px+env(safe-area-inset-top))] lg:pt-[72px]">
          {children}
        </main>
        <Footer />
        <SiteChatbot />
      </body>
    </html>
  );
}
