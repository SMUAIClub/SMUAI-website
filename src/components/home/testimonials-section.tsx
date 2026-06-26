"use client";

import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { testimonials } from "@/content/home";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3);
        return;
      }

      if (window.innerWidth >= 640) {
        setSlidesToShow(2);
        return;
      }

      setSlidesToShow(1);
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);

    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - slidesToShow);
  const safeIndex = Math.min(activeIndex, maxIndex);
  const pageStarts = useMemo(() => {
    const starts: number[] = [];
    for (let index = 0; index <= maxIndex; index += slidesToShow) {
      starts.push(index);
    }

    if (starts.length === 0 || starts[starts.length - 1] !== maxIndex) {
      starts.push(maxIndex);
    }

    return Array.from(new Set(starts));
  }, [maxIndex, slidesToShow]);

  const previous = () => {
    setActiveIndex((current) => (Math.min(current, maxIndex) === 0 ? maxIndex : Math.min(current, maxIndex) - 1));
  };

  const next = () => {
    setActiveIndex((current) => (Math.min(current, maxIndex) >= maxIndex ? 0 : Math.min(current, maxIndex) + 1));
  };

  return (
    <section className="bg-white px-5 py-20 text-brand-deep-blue lg:px-8">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Testimonials</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">What Our Community Says</h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-slate">
            Perspectives from EXCO members and participants across SMUAI&apos;s events, workshops, and projects.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous testimonial"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-brand-soft bg-brand-cloud text-brand-deep-blue transition hover:bg-brand-pale-gold lg:inline-flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out sm:gap-5"
              style={{
                transform: `translateX(-${safeIndex * (100 / slidesToShow)}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="shrink-0"
                  style={{ width: `calc((100% - ${(slidesToShow - 1) * 20}px) / ${slidesToShow})` }}
                >
                  <article className="h-full rounded-[28px] border border-brand-soft bg-white p-5 shadow-[0_28px_52px_-38px_rgba(27,43,84,0.35)] sm:p-6 lg:p-7">
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

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-brand-soft bg-brand-cloud text-brand-deep-blue transition hover:bg-brand-pale-gold lg:inline-flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-soft bg-brand-cloud text-brand-deep-blue transition hover:bg-brand-pale-gold"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-soft bg-brand-cloud text-brand-deep-blue transition hover:bg-brand-pale-gold"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {pageStarts.length > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-2">
            {pageStarts.map((pageStart) => {
              const isActive = safeIndex === pageStart;
              return (
                <button
                  key={`testimonial-page-${pageStart}`}
                  type="button"
                  onClick={() => setActiveIndex(pageStart)}
                  aria-label={`Go to testimonial group ${pageStarts.indexOf(pageStart) + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive ? "w-8 bg-brand-deep-blue" : "w-2.5 bg-brand-soft hover:bg-brand-slate/50"
                  }`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
