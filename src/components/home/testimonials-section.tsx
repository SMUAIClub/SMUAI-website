"use client";

import { Quote } from "lucide-react";
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

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    element.scrollLeft = getTestimonialsSegmentWidth(element);

    let frameId = 0;
    let lastTs = 0;

    const tick = (ts: number) => {
      if (!lastTs) {
        lastTs = ts;
      }

      const delta = ts - lastTs;
      lastTs = ts;

      if (!isPaused && !dragStateRef.current.isDragging) {
        element.scrollLeft += delta * TESTIMONIAL_SCROLL_SPEED;
        normalizeScrollPosition(element);
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused]);

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
    element.releasePointerCapture(event.pointerId);
    setIsPaused(false);
  };

  return (
    <section className="bg-brand-cloud px-5 py-20 text-brand-deep-blue lg:px-8">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Testimonials</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">What Our Community Says</h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-slate">
            Perspectives from EXCO members and participants across SMUAI&apos;s events, workshops, and projects.
          </p>
        </div>
      </div>

      <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2">
        <div
          ref={scrollRef}
          className="overflow-x-auto px-5 py-3 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
          <div className="flex w-max gap-5 px-1 sm:px-2">
            {marqueeTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="w-[84vw] max-w-[420px] shrink-0 cursor-grab active:cursor-grabbing sm:w-[420px]"
              >
                <article className="h-full rounded-[28px] border border-brand-soft bg-white p-5 shadow-[0_28px_52px_-38px_rgba(27,43,84,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_58px_-36px_rgba(27,43,84,0.34)] sm:p-6 lg:p-7">
                  <Quote className="text-brand-deep-blue/75" size={26} />
                  <p className="mt-4 text-base leading-relaxed text-brand-slate lg:text-lg">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-brand-soft pt-4">
                    <p className="text-base font-bold text-brand-deep-blue">{testimonial.name}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-brand-slate sm:text-sm">
                      {testimonial.role}
                    </p>
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
