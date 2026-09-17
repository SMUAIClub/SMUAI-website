"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { PointerEvent } from "react";
import { heroGalleryImages } from "@/content/home";

const CYCLE_MS = 2600;
const TRANSITION_MS = 900;
const SNAP_MS = 320;
const wrap = (value: number) => ((value % heroGalleryImages.length) + heroGalleryImages.length) % heroGalleryImages.length;

function GalleryPhoto({ src, index, position }: { src: string; index: number; position: MotionValue<number> }) {
  const offset = useTransform(position, (value) => {
    const count = heroGalleryImages.length;
    return ((index - 2 - value + count * 2 + count / 2) % count) - count / 2;
  });
  const left = useTransform(offset, (value) => `${50 + value * 20}%`);
  const y = useTransform(offset, (value) => {
    const distance = Math.abs(value);
    const stagger = distance <= 1 ? 34 - distance * 26 : 8 - Math.min(distance - 1, 1) * 22;
    return `calc(${stagger}px * var(--hero-stagger))`;
  });

  return (
    <motion.figure style={{ left, y }} className="pointer-events-none absolute top-4 -translate-x-1/2 overflow-hidden rounded-[1.25rem] sm:top-8 sm:rounded-[1.9rem] border border-brand-soft bg-brand-cloud shadow-[0_25px_45px_-42px_rgba(27,43,84,0.5)]">
      <div className="relative aspect-[20/13] w-[var(--hero-card-width)]">
        <Image src={src} alt="SMUAI gallery" fill draggable={false} sizes="(min-width: 1500px) 360px, (min-width: 1400px) 24vw, (min-width: 1024px) 336px, (min-width: 640px) 288px, (min-width: 411px) 320px, 78vw" quality={72} className="object-cover" />
      </div>
    </motion.figure>
  );
}

export default function HeroGallery() {
  const position = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; position: number; pitch: number } | null>(null);
  const autoRef = useRef({ elapsed: 0, from: 0 });
  const snapRef = useRef<{ elapsed: number; from: number; to: number } | null>(null);
  const focusedRef = useRef(false);

  const restartAutoplay = () => {
    autoRef.current = { elapsed: 0, from: position.get() };
  };

  useAnimationFrame((_time, delta) => {
    if (dragRef.current) return;
    const snap = snapRef.current;
    if (snap) {
      snap.elapsed += Math.min(delta, 64);
      const progress = reducedMotion ? 1 : Math.min(1, snap.elapsed / SNAP_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      position.set(wrap(snap.from + (snap.to - snap.from) * eased));
      if (progress === 1) {
        snapRef.current = null;
        restartAutoplay();
      }
      return;
    }
    if (focusedRef.current || reducedMotion) return;
    const auto = autoRef.current;
    auto.elapsed += Math.min(delta, 64);
    const progress = Math.max(0, Math.min(1, (auto.elapsed - (CYCLE_MS - TRANSITION_MS)) / TRANSITION_MS));
    const eased = 1 - Math.pow(1 - progress, 3);
    position.set(wrap(auto.from + eased));
    if (progress === 1) restartAutoplay();
  });

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || !trackRef.current || dragRef.current) return;
    focusedRef.current = false;
    snapRef.current = null;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      position: position.get(),
      pitch: trackRef.current.getBoundingClientRect().width / 5,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    const from = position.get();
    // Round before wrapping so the last photo snaps across the loop's seam
    // by a fraction of a slot, rather than travelling back through the gallery.
    snapRef.current = { elapsed: 0, from, to: Math.round(from) };
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      role="region"
      aria-label="SMUAI photo gallery"
      aria-describedby="hero-gallery-instructions"
      tabIndex={0}
      onFocus={(event) => { focusedRef.current = event.currentTarget.matches(":focus-visible"); }}
      onBlur={() => { focusedRef.current = false; restartAutoplay(); }}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        snapRef.current = null;
        position.set(wrap(Math.round(position.get()) + (event.key === "ArrowRight" ? 1 : -1)));
        restartAutoplay();
      }}
      onPointerDown={startDrag}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        position.set(wrap(drag.position - (event.clientX - drag.x) / drag.pitch));
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      className="relative left-1/2 h-[calc(var(--hero-card-width)*0.65+2rem)] sm:h-[calc(var(--hero-card-width)*0.65+6rem)] w-screen -translate-x-1/2 cursor-grab touch-pan-y select-none overflow-hidden outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-brand-deep-blue active:cursor-grabbing [--hero-card-width:min(78vw,20rem)] [--hero-card-gap:0.75rem] [--hero-stagger:0] sm:[--hero-card-width:18rem] sm:[--hero-card-gap:1.5rem] sm:[--hero-stagger:1] lg:[--hero-card-width:clamp(21rem,24vw,22.5rem)]"
    >
      <p id="hero-gallery-instructions" className="sr-only">Drag left or right to move the photos at your own pace, or use the left and right arrow keys. Automatic movement pauses while dragging or while the gallery has keyboard focus.</p>
      <div ref={trackRef} className="absolute inset-y-0 left-1/2 w-[calc((var(--hero-card-width)+var(--hero-card-gap))*5)] min-w-full -translate-x-1/2">
        {heroGalleryImages.map((src, index) => <GalleryPhoto key={src} src={src} index={index} position={position} />)}
      </div>
    </div>
  );
}
