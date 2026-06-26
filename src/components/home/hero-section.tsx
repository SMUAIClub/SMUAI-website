"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Gravity, { MatterBody } from "@/components/fancy/physics/cursor-attractor-and-gravity";
import { heroGalleryImages } from "@/content/home";

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

export default function HeroSection() {
  const slots = [
    { x: 9, y: -14 },
    { x: 29.5, y: 8 },
    { x: 50, y: 34 },
    { x: 70.5, y: 8 },
    { x: 91, y: -14 },
  ];
  const [carouselItems, setCarouselItems] = useState(() =>
    heroGalleryImages.slice(0, slots.length).map((src, index) => ({ id: index + 1, src }))
  );
  const nextImageRef = useRef(slots.length);
  const idRef = useRef(slots.length + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselItems((current) => {
        const nextSrc = heroGalleryImages[nextImageRef.current % heroGalleryImages.length];
        nextImageRef.current += 1;

        return [...current.slice(1), { id: idRef.current++, src: nextSrc }];
      });
    }, 2600);

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
        <div className="max-w-4xl">
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
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-brand-slate sm:mt-10 sm:text-[20px]">
            SMUAI is a student-led AI community where students learn, build, and connect through innovation and industry.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-brand-slate sm:mt-4 sm:text-[20px]">
            We are proudly supported by the Singapore Management University&apos;s Institute of Innovation and Entrepreneurship (SMU
            IIE).
          </p>
        </div>
      </div>

      <div className="relative mt-6 w-full overflow-hidden py-3 sm:mt-14 sm:py-10">
        <div className="mx-auto block w-full max-w-[1320px] px-5 sm:hidden">
          <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {heroGalleryImages.slice(0, 5).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-[4/5] w-[42vw] min-w-[138px] max-w-[176px] flex-none snap-start overflow-hidden rounded-2xl border border-brand-soft bg-brand-cloud shadow-[0_20px_36px_-30px_rgba(27,43,84,0.35)]"
              >
                <Image src={src} alt="SMUAI gallery" fill sizes="(max-width: 640px) 44vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto hidden h-[260px] w-full max-w-[1320px] px-2 sm:block sm:px-5 lg:px-8">
          <AnimatePresence initial={false}>
            {carouselItems.map((item, slotIndex) => {
              const slot = slots[slotIndex];
              const isEdge = slotIndex === 0 || slotIndex === slots.length - 1;

              return (
                <motion.figure
                  key={item.id}
                  initial={{ left: "106%", y: slots[slots.length - 1].y, opacity: 0.55 }}
                  animate={{ left: `${slot.x}%`, y: slot.y, opacity: 1 }}
                  exit={{ left: "-12%", y: slots[0].y, opacity: 0.5 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute top-8 -translate-x-1/2 overflow-hidden rounded-2xl border border-brand-soft bg-brand-cloud shadow-[0_25px_45px_-42px_rgba(27,43,84,0.5)] ${
                    isEdge ? "hidden md:block" : ""
                  }`}
                >
                  <div className="relative h-44 w-56 md:h-48 md:w-72">
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
