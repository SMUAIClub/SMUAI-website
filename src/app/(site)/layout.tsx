import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SiteChatbot from "@/components/site-chatbot";
import { Analytics } from "@vercel/analytics/next";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip pt-[calc(var(--site-header-height)+env(safe-area-inset-top))]">
        {children}
      </main>
      <Footer />
      <SiteChatbot />
      <Analytics />
    </>
  );
}
