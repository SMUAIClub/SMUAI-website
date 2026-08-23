"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import BrandLogo from "./brand-logo";

const LINKTREE_URL = "https://linktr.ee/smuai";
const MEMBERSHIP_FORM_URL = "https://forms.gle/7UeUbNhu4fPJqCbs9";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

function LinktreeMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[15px] w-[15px]">
      <path
        d="M10.58 3h2.84v6.18l5.37-5.37 2.01 2.01-5.37 5.37h6.18v2.84h-6.18l5.37 5.37-2.01 2.01-5.37-5.37V22h-2.84v-5.96l-5.37 5.37-2.01-2.01 5.37-5.37H2.38v-2.84h6.18L3.19 5.82l2.01-2.01 5.37 5.37z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });

  useEffect(() => {
    const updatePill = () => {
      const activeItem = itemRefs.current[pathname];

      if (!activeItem) {
        setPillStyle((current) => ({ ...current, opacity: 0 }));
        return;
      }

      setPillStyle({
        width: activeItem.offsetWidth,
        left: activeItem.offsetLeft,
        opacity: 1,
      });
    };

    updatePill();
    window.addEventListener("resize", updatePill);

    return () => window.removeEventListener("resize", updatePill);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-deep-blue pt-[env(safe-area-inset-top)] text-white backdrop-blur-xl">
      <div className="relative mx-auto flex w-full max-w-[1380px] items-center justify-between px-5 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-8">
        <Link href="/" className="transition-transform duration-300 hover:scale-[1.02] md:justify-self-start">
          <BrandLogo />
        </Link>

        <nav
          className="relative hidden h-[2.625rem] items-center gap-0.5 rounded-full border border-white/15 bg-white/6 p-0.5 md:flex md:justify-self-center"
        >
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-brand-gold"
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
                  "relative inline-flex h-9 items-center justify-center rounded-full px-3.5 text-[13px] font-semibold tracking-[0.01em] transition-colors",
                  isActive ? "text-brand-deep-blue" : "text-white hover:text-brand-gold"
                )}
              >
                <span className="relative z-10 inline-flex items-center justify-center text-center leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex md:justify-self-end">
          <a
            href={LINKTREE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="SMUAI Linktree"
            title="SMUAI Linktree"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-brand-gold hover:bg-white/12 hover:text-brand-gold"
          >
            <LinktreeMark />
          </a>
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 10px 24px -18px rgba(255, 255, 255, 0.08)",
                "0 16px 34px -16px rgba(255, 255, 255, 0.18)",
                "0 10px 24px -18px rgba(255, 255, 255, 0.08)",
              ],
            }}
            transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="rounded-full"
          >
            <a
              href={MEMBERSHIP_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className={clsx(
                "group relative inline-flex min-h-11 items-center overflow-hidden rounded-full border px-4 py-2 text-left transition",
                "border-white/20 bg-white/10 text-white hover:-translate-y-0.5 hover:border-brand-gold hover:bg-white/12"
              )}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[-45%] w-[50%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.03),rgba(255,255,255,0.18),rgba(255,255,255,0.03),transparent)] blur-[1px]"
                animate={{ x: ["-150%", "240%"] }}
                transition={{ duration: 3.1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.1, ease: "easeInOut" }}
              />
              <span className="relative z-10 truncate text-sm font-semibold text-white/88">Join SMUAI</span>
            </a>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={LINKTREE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="SMUAI Linktree"
            title="SMUAI Linktree"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:border-brand-gold hover:bg-white/12 hover:text-brand-gold"
          >
            <LinktreeMark />
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 p-2"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-[rgba(7,14,32,0.34)] backdrop-blur-[2px] md:hidden"
            />
            <motion.aside
              id="mobile-nav"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="fixed right-3 top-[calc(env(safe-area-inset-top)+5rem)] z-50 w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-[1.75rem] border border-white/14 bg-brand-deep-blue/96 shadow-[0_32px_70px_-28px_rgba(7,14,32,0.72)] backdrop-blur-xl md:hidden"
            >
              <div className="border-b border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                      Navigate
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">SMUAI</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition hover:bg-white/14"
                    aria-label="Close navigation panel"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-4 py-4">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-brand-gold text-brand-deep-blue"
                            : "bg-white/6 text-white hover:bg-white/10 hover:text-brand-gold"
                        )}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <a
                    href={MEMBERSHIP_FORM_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      "inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      "border border-white/16 bg-white text-brand-deep-blue shadow-[0_18px_30px_-20px_rgba(255,255,255,0.55)]"
                    )}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.025, 1] }}
                      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      Join as a Member
                    </motion.span>
                  </a>

                  <a
                    href={LINKTREE_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/7 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-gold hover:text-brand-gold"
                  >
                    <LinktreeMark />
                    Linktree
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
