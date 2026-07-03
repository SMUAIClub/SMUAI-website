"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Gravity, { MatterBody } from "@/components/fancy/physics/cursor-attractor-and-gravity";
import { heroGalleryImages } from "@/content/home";

const HERO_SLOTS = [
  { x: 7.5, y: -14 },
  { x: 28, y: 8 },
  { x: 50, y: 34 },
  { x: 72, y: 8 },
  { x: 92.5, y: -14 },
] as const;

const HERO_CAROUSEL_MS = 2600;

const heroParticles = Array.from({ length: 80 }, (_, index) => {
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

  return (
    <section className="relative flex min-h-0 flex-col justify-start overflow-hidden bg-white pb-8 pt-6 sm:pb-12 sm:pt-10 lg:min-h-[calc(100svh-78px)] lg:justify-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(27,43,84,0.06),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(81,97,133,0.08),transparent_44%)]" />
      <div className="absolute inset-0 hidden opacity-80 sm:block">
        <Gravity attractorStrength={0} cursorStrength={0.00032} cursorFieldRadius={180} className="h-full w-full" addTopWall={false}>
          {heroParticles.map((particle, index) => (
            <MatterBody
              key={`hero-particle-${index}`}
              bodyType="circle"
              x={particle.x}
              y={particle.y}
              matterBodyOptions={{ friction: 0.5, restitution: 0.28, density: 0.0007 }}
            >
              <div className="rounded-full bg-brand-gold/70" style={{ width: `${particle.size}px`, height: `${particle.size}px` }} />
            </MatterBody>
          ))}
        </Gravity>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col items-center px-5 text-center lg:px-8">
        <div className="w-full max-w-4xl">
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
        </div>
      </div>

      <div className="relative mt-6 w-full overflow-hidden py-3 sm:mt-14 sm:py-10">
        <div className="mx-auto block w-full max-w-[1320px] px-5 sm:hidden">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-slate">
            Swipe Through Moments
          </p>
          <div className="-mx-5 overflow-x-auto px-5 pb-2 pt-1 touch-pan-x overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x snap-mandatory gap-4">
              {heroGalleryImages.map((src, index) => (
                <figure
                  key={`${src}-${index}`}
                  className="relative aspect-[4/5] w-[78vw] min-w-[78vw] max-w-[320px] flex-none snap-center overflow-hidden rounded-[1.6rem] border border-brand-soft bg-brand-cloud shadow-[0_24px_40px_-30px_rgba(27,43,84,0.35)]"
                >
                  <Image
                    src={src}
                    alt="SMUAI gallery"
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 78vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto hidden h-[280px] w-full max-w-[1320px] px-2 sm:block sm:px-5 lg:h-[300px] lg:px-8">
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
                  className={`absolute top-8 -translate-x-1/2 overflow-hidden rounded-2xl border border-brand-soft bg-brand-cloud shadow-[0_25px_45px_-42px_rgba(27,43,84,0.5)] ${
                    isEdge ? "hidden md:block" : ""
                  }`}
                >
                  <div className="relative h-44 w-60 md:h-48 md:w-72 lg:h-52 lg:w-80">
                    <Image src={item.src} alt="SMUAI gallery" fill className="object-cover" />
                  </div>
                </motion.figure>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
