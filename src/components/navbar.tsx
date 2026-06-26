"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import BrandLogo from "./brand-logo";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ width: 0, x: 0, opacity: 0 });

  useEffect(() => {
    const updatePill = () => {
      const activeItem = itemRefs.current[pathname];
      const nav = navRef.current;

      if (!activeItem || !nav) {
        setPillStyle((current) => ({ ...current, opacity: 0 }));
        return;
      }

      setPillStyle({
        width: activeItem.offsetWidth,
        x: activeItem.offsetLeft,
        opacity: 1,
      });
    };

    updatePill();
    window.addEventListener("resize", updatePill);

    return () => window.removeEventListener("resize", updatePill);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-deep-blue text-white backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-[1380px] items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="transition-transform duration-300 hover:scale-[1.02]">
          <BrandLogo />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-2 rounded-full border border-white/15 bg-white/6 p-1 md:flex"
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-full bg-brand-gold"
            animate={{
              x: pillStyle.x,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(node) => {
                  itemRefs.current[item.href] = node;
                }}
                className={clsx(
                  "relative rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
                  isActive ? "text-brand-deep-blue" : "text-white hover:text-brand-gold"
                )}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://api.opine.asia/telegram/survey/441d6327-6cf7-49d3-98d0-ccdb72f72667"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <Sparkles size={15} />
            Join SMUAI
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 p-2 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative overflow-hidden border-t border-white/10 bg-brand-deep-blue/95 px-5 md:hidden"
          >
            <div className="space-y-2 py-4">
              <a
                href="https://api.opine.asia/telegram/survey/441d6327-6cf7-49d3-98d0-ccdb72f72667"
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-deep-blue"
              >
                <Sparkles size={15} />
                Join SMUAI
              </a>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "block rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-brand-gold text-brand-deep-blue"
                        : "text-white hover:bg-white/10 hover:text-brand-gold"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
