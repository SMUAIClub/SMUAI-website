"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const isMembershipPage = pathname === "/membership";
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });

  useEffect(() => {
    const updatePill = () => {
      const activeItem = itemRefs.current[pathname];
      const nav = navRef.current;

      if (!activeItem || !nav) {
        setPillStyle((current) => ({ ...current, opacity: 0 }));
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      setPillStyle({
        width: itemRect.width,
        left: itemRect.left - navRect.left,
        opacity: 1,
      });
    };

    updatePill();
    window.addEventListener("resize", updatePill);

    return () => window.removeEventListener("resize", updatePill);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-deep-blue pt-[env(safe-area-inset-top)] text-white backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-[1380px] items-center justify-between px-5 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-8">
        <Link href="/" className="transition-transform duration-300 hover:scale-[1.02] md:justify-self-start">
          <BrandLogo />
        </Link>

        <nav
          ref={navRef}
          className="relative hidden h-11 items-center gap-1 rounded-full border border-white/15 bg-white/6 p-0.5 md:flex md:justify-self-center"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0.5 rounded-full bg-brand-gold"
            initial={false}
            animate={{
              left: pillStyle.left,
              width: pillStyle.width,
              opacity: pillStyle.opacity,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 42, mass: 0.7 }}
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
                  "relative inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold tracking-wide transition-colors",
                  isActive ? "text-brand-deep-blue" : "text-white hover:text-brand-gold"
                )}
              >
                <span className="relative z-10 text-center leading-none">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex md:justify-self-end">
          <Link
            href="/membership"
            aria-current={isMembershipPage ? "page" : undefined}
            className={clsx(
              "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-left transition",
              isMembershipPage
                ? "border-brand-gold/45 bg-white/14 text-white"
                : "border-white/20 bg-white/10 text-white hover:border-brand-gold hover:bg-white/12"
            )}
          >
            <span className="truncate text-sm font-medium text-white/80">
              {isMembershipPage ? "Membership" : "Join SMUAI"}
            </span>
          </Link>
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
              <Link
                href="/membership"
                aria-current={isMembershipPage ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "mb-3 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isMembershipPage
                    ? "border border-brand-gold/40 bg-white/10 text-white"
                    : "bg-brand-gold text-brand-deep-blue shadow-[0_14px_30px_-18px_rgba(255,204,0,0.85)]"
                )}
              >
                {isMembershipPage ? "Membership Page" : "Join as a Member"}
              </Link>
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
