"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Gravity, { MatterBody } from "@/components/fancy/physics/cursor-attractor-and-gravity";
import HeroGallery from "./hero-gallery";

const HERO_STARTUP_IDLE_MS = 900;
const HERO_PARTICLE_BODY_OPTIONS = {
  friction: 0.08,
  frictionAir: 0.035,
  restitution: 0.55,
  density: 0.0007,
};

const heroParticles = Array.from({ length: 48 }, (_, index) => {
  const seedX = (index * 37 + 11) % 100;
  const seedY = (index * 53 + 17) % 100;
  const size = 4 + (index % 3);

  return {
    x: `${seedX}%`,
    y: `${seedY}%`,
    size,
  };
});

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [enableHeroPhysics, setEnableHeroPhysics] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | null = null;
    const canUseIdleCallback =
      typeof window !== "undefined" &&
      typeof window.requestIdleCallback === "function" &&
      typeof window.cancelIdleCallback === "function";

    const activate = () => {
      if (!cancelled) {
        setEnableHeroPhysics(true);
      }
    };

    if (canUseIdleCallback) {
      const idleId = window.requestIdleCallback(activate, { timeout: HERO_STARTUP_IDLE_MS });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    timeoutId = window.setTimeout(activate, HERO_STARTUP_IDLE_MS);

    return () => {
      cancelled = true;
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(27,43,84,0.06),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(81,97,133,0.08),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-10 h-56 bg-[radial-gradient(circle_at_50%_45%,rgba(255,209,1,0.18),rgba(255,209,1,0.08)_24%,transparent_64%)] blur-3xl sm:top-16 sm:h-72" />
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {enableHeroPhysics && !reducedMotion ? (
          <Gravity
            attractorStrength={0}
            cursorStrength={0.00045}
            cursorFieldRadius={190}
            clickImpulse={4}
            className="pointer-events-none h-full w-full select-none"
            addTopWall
          >
            {heroParticles.map((particle, index) => (
              <MatterBody
                key={`hero-particle-${index}`}
                bodyType="circle"
                x={particle.x}
                y={particle.y}
                matterBodyOptions={HERO_PARTICLE_BODY_OPTIONS}
              >
                <div
                  className="pointer-events-none rounded-full bg-brand-gold"
                  style={{ width: `${particle.size}px`, height: `${particle.size}px` }}
                />
              </MatterBody>
            ))}
          </Gravity>
        ) : (
          heroParticles.map((particle, index) => (
            <span
              key={`hero-particle-static-${index}`}
              className="absolute rounded-full bg-brand-gold"
              style={{
                left: particle.x,
                top: particle.y,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))
        )}
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-var(--site-header-height)-env(safe-area-inset-top))] w-full max-w-[1320px] flex-col px-5 pb-20 pt-12 text-center sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center pt-6 sm:pt-10"
        >
          <div className="relative mx-auto inline-flex">
            <Image
              src="/brand/smuai_navy_logo.png"
              alt="SMUAI"
              width={420}
              height={131}
              priority
              className="relative z-10 mx-auto h-auto w-[220px] sm:w-[340px] lg:w-[420px]"
            />
          </div>
          <h1 className="mt-10 text-3xl font-black leading-tight tracking-tight text-brand-deep-blue sm:mt-12 sm:text-4xl">
            Your place to explore AI at SMU
          </h1>
          <p className="mx-auto mt-4 w-full max-w-3xl text-base leading-relaxed text-brand-slate sm:text-lg">
            We’re a student-led community bringing AI to life through hands-on workshops, hackathons, research, and conversations with industry. Whether you’re just curious or already building, there’s a place for you here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-full sm:mt-12"
        >
          <HeroGallery />
          <p className="mx-auto mt-6 max-w-5xl text-center text-[13px] font-normal leading-relaxed text-brand-slate sm:mt-7 sm:text-sm">
            Proudly supported by Singapore Management University&apos;s{" "}
            <a href="https://iie.smu.edu.sg" target="_blank" rel="noopener noreferrer" className="rounded-sm font-medium underline decoration-brand-slate/40 underline-offset-2 transition-colors hover:text-brand-deep-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep-blue">
              Institute of Innovation and Entrepreneurship (SMU IIE)
            </a>.
          </p>
        </motion.div>

        <motion.div
          animate={hasScrolled ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 sm:bottom-6"
        >
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-brand-deep-blue/20 bg-white/32 p-1 shadow-[0_10px_24px_-18px_rgba(27,43,84,0.3)] backdrop-blur-[2px] sm:h-9 sm:w-6">
            <motion.span
              animate={{ y: [0, 8, 0], opacity: [0.95, 0.35, 0.95] }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="block h-2.5 w-1 rounded-full bg-brand-deep-blue/55"
            />
          </div>
          <span className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-slate/65 sm:text-[11px]">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
