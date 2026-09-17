"use client";

import { Pause, Play, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/home";

const TESTIMONIAL_REPEAT_COUNT = 3;
const TESTIMONIAL_SCROLL_SPEED = 0.045;
const marqueeTestimonials = Array.from(
  { length: TESTIMONIAL_REPEAT_COUNT },
  () => testimonials,
).flat();

function getTestimonialsSegmentWidth(element: HTMLDivElement) {
  return element.scrollWidth / TESTIMONIAL_REPEAT_COUNT;
}

function normalizeScrollPosition(element: HTMLDivElement) {
  const segmentWidth = getTestimonialsSegmentWidth(element);

  if (element.scrollLeft < segmentWidth * 0.5) {
    element.scrollLeft += segmentWidth;
  } else if (element.scrollLeft > segmentWidth * 1.5) {
    element.scrollLeft -= segmentWidth;
  }
}

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, startScrollLeft: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [manualPause, setManualPause] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    element.scrollLeft = getTestimonialsSegmentWidth(element);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    let frameId = 0;
    let lastTs = 0;

    const tick = (ts: number) => {
      if (!lastTs) {
        lastTs = ts;
      }

      const delta = ts - lastTs;
      lastTs = ts;

      if (!isPaused && !manualPause && !dragStateRef.current.isDragging) {
        element.scrollLeft += delta * TESTIMONIAL_SCROLL_SPEED;
        normalizeScrollPosition(element);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused, manualPause]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: element.scrollLeft,
    };

    setIsPaused(true);
    element.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element || !dragStateRef.current.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    element.scrollLeft = dragStateRef.current.startScrollLeft - deltaX;
    normalizeScrollPosition(element);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragStateRef.current.isDragging = false;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    setIsPaused(false);
  };

  return (
    <section aria-labelledby="testimonials-heading" className="overflow-x-clip bg-brand-cloud py-14 text-brand-deep-blue lg:py-16">
      <div className="mx-auto flex w-full max-w-[1264px] flex-col gap-5 px-5 sm:flex-row sm:items-end sm:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Our community</p>
          <h2 id="testimonials-heading" className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">In their own words.</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-slate">The experiences that stay with our members and participants.</p>
        </div>
        <button type="button" onClick={() => setManualPause((paused) => !paused)} aria-label={manualPause ? "Resume testimonials" : "Pause testimonials"} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-brand-deep-blue/20 px-4 text-xs font-semibold transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue sm:self-auto">
          {manualPause ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {manualPause ? "Resume" : "Pause to read"}
        </button>
      </div>

      <div className="relative mt-7 w-full sm:mt-8">
        <div
          ref={scrollRef}
          className="touch-pan-y overflow-x-auto px-5 py-3 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!dragStateRef.current.isDragging) {
              setIsPaused(false);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="flex w-max gap-5 px-1 sm:gap-6 sm:px-2">
            {marqueeTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="w-[85vw] max-w-[380px] shrink-0 cursor-grab active:cursor-grabbing sm:w-[440px] sm:max-w-[440px]"
              >
                <article className="flex h-full flex-col rounded-[1.5rem] border border-brand-deep-blue/10 bg-white p-6 sm:rounded-[2rem] sm:p-8">
                  <Quote aria-hidden="true" className="text-brand-gold" size={30} strokeWidth={2.5} />
                  <blockquote className="mb-7 mt-4 flex-1 text-base font-medium leading-[1.75] text-brand-deep-blue">
                    <p>{testimonial.quote}</p>
                  </blockquote>
                  <div className="flex items-center gap-3 border-t border-brand-soft pt-5">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cloud text-xs font-bold text-brand-deep-blue">
                      {testimonial.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-deep-blue">{testimonial.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-slate">{testimonial.role}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
