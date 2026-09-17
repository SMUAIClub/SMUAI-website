"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Gravity, { MatterBody } from "@/components/fancy/physics/cursor-attractor-and-gravity";
import { heroGalleryImages } from "@/content/home";

const HERO_SLOTS = [
  { x: 8.5, y: -14 },
  { x: 29.5, y: 8 },
  { x: 50, y: 34 },
  { x: 70.5, y: 8 },
  { x: 91.5, y: -14 },
] as const;

const HERO_CAROUSEL_MS = 2600;
const HERO_STARTUP_IDLE_MS = 900;
const HERO_PARTICLE_BODY_OPTIONS = {
  friction: 0.5,
  restitution: 0.28,
  density: 0.0007,
};

const heroParticles = Array.from({ length: 56 }, (_, index) => {
  const seedX = (index * 37 + 11) % 100;
  const seedY = (index * 53 + 17) % 100;
  const size = (index % 3) + 4;

  return {
    x: `${seedX}%`,
    y: `${seedY}%`,
    size,
  };
});

function getInitialCarouselItems() {
  return heroGalleryImages
    .slice(0, HERO_SLOTS.length)
    .map((src, index) => ({ id: index + 1, src }));
}

export default function HeroSection() {
  const [carouselItems, setCarouselItems] = useState(getInitialCarouselItems);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [enableHeroPhysics, setEnableHeroPhysics] = useState(false);
  const nextImageRef = useRef(HERO_SLOTS.length);
  const idRef = useRef(HERO_SLOTS.length + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselItems((current) => {
        const nextSrc = heroGalleryImages[nextImageRef.current % heroGalleryImages.length];
        nextImageRef.current += 1;

        return [...current.slice(1), { id: idRef.current++, src: nextSrc }];
      });
    }, HERO_CAROUSEL_MS);

    return () => clearInterval(interval);
  }, []);

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
        {enableHeroPhysics ? (
          <Gravity
            attractorStrength={0}
            cursorStrength={0.00032}
            cursorFieldRadius={180}
            className="pointer-events-none h-full w-full select-none"
            addTopWall={false}
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
                  className="pointer-events-none rounded-full bg-brand-gold/70"
                  style={{ width: `${particle.size}px`, height: `${particle.size}px` }}
                />
              </MatterBody>
            ))}
          </Gravity>
        ) : (
          heroParticles.map((particle, index) => (
            <span
              key={`hero-particle-static-${index}`}
              className="absolute rounded-full bg-brand-gold/70"
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

      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] w-full max-w-[1320px] flex-col px-5 pb-20 pt-12 text-center sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center pt-6 sm:pt-10"
        >
          <div className="relative mx-auto inline-flex overflow-hidden rounded-[24px] border border-brand-soft/80 px-4 py-3 shadow-[0_28px_60px_-48px_rgba(27,43,84,0.55)] sm:rounded-[28px] sm:px-5 sm:py-4">
            <Image
              src="/brand/smuai_navy_logo.png"
              alt="SMUAI"
              width={420}
              height={131}
              priority
              className="relative z-10 mx-auto h-auto w-[220px] sm:w-[340px] lg:w-[420px]"
            />
          </div>
          <p className="mx-auto mt-6 w-full max-w-3xl text-base leading-relaxed text-brand-slate max-sm:max-w-[21rem] max-sm:text-[0.96rem] sm:mt-10 sm:text-[20px]">
            SMUAI is a student-led AI community where students learn, build, and connect through innovation and industry.
          </p>
          <p className="mx-auto mt-3 w-full max-w-3xl text-sm leading-relaxed text-brand-slate max-sm:max-w-[21rem] sm:mt-4 sm:text-[20px]">
            We are proudly supported by the Singapore Management University&apos;s Institute of Innovation and Entrepreneurship (SMU
            IIE).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 w-full sm:mt-14"
        >
          <div className="relative left-1/2 h-[250px] w-screen -translate-x-1/2 overflow-hidden sm:h-[280px] lg:h-[300px]">
            <AnimatePresence initial={false}>
              {carouselItems.map((item, slotIndex) => {
                const slot = HERO_SLOTS[slotIndex];
                const isEdge = slotIndex === 0 || slotIndex === HERO_SLOTS.length - 1;

                return (
                  <motion.figure
                    key={item.id}
                    initial={{ left: "106%", y: HERO_SLOTS[HERO_SLOTS.length - 1].y, opacity: 0.55 }}
                    animate={{ left: `${slot.x}%`, y: slot.y, opacity: 1 }}
                    exit={{ left: "-12%", y: HERO_SLOTS[0].y, opacity: 0.5 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute top-8 -translate-x-1/2 overflow-hidden rounded-[1.9rem] border border-brand-soft bg-brand-cloud shadow-[0_25px_45px_-42px_rgba(27,43,84,0.5)] ${isEdge ? "hidden md:block" : ""}`}
                  >
                    <div className="relative h-40 w-56 sm:h-44 sm:w-60 md:h-48 md:w-[18rem] lg:h-52 lg:w-[20rem]">
                      <Image
                        src={item.src}
                        alt="SMUAI gallery"
                        fill
                        sizes="(min-width: 1280px) 320px, (min-width: 768px) 288px, 224px"
                        quality={72}
                        className="object-cover"
                      />
                    </div>
                  </motion.figure>
                );
              })}
            </AnimatePresence>
          </div>
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
