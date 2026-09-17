"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const activities = [
  {
    id: "workshops",
    title: "Workshops",
    headline: "Get hands-on with AI.",
    description: "Try the tools, learn from practitioners, and put new skills to work in guided sessions.",
    image: "/activities/workshops.jpg?v=2",
    alt: "SMUAI workshops",
    example: "Claude101 Workshop",
    detail: "Build, learn, and get certified with ClaudeSG × SMUAI.",
  },
  {
    id: "hackathons",
    title: "Hackathons",
    headline: "Turn an idea into something real.",
    description: "Team up, experiment, and build a working prototype. Learn as much from each other as from the challenge.",
    image: "/activities/hackathon.jpg?v=2",
    alt: "SMUAI hackathons and building sessions",
    example: 'Tencent Cloud “AI CAN DO IT” Hackathon',
    detail: "Putting AI ideas into practice through a hands-on building challenge.",
  },
  {
    id: "networking",
    title: "Networking",
    headline: "Meet the people behind the ideas.",
    description: "Share a conversation with founders, industry practitioners, and fellow students exploring AI.",
    image: "/activities/networking.jpg?v=2",
    alt: "SMUAI networking events",
    example: "OpenClaw Agentic Night",
    detail: "Bringing the agentic AI community together to connect and exchange ideas.",
  },
  {
    id: "research",
    title: "Research",
    headline: "Go beyond the black box.",
    description: "Explore AI papers, discuss emerging ideas, and develop your own research questions with guidance from mentors and fellow students.",
    image: "/activities/research.jpg?v=2",
    alt: "Learning and exploring AI at SMUAI",
    example: "Early Research Opportunity Program (EROP)",
    detail: "From technical papers to research proposals in five days.",
  },
] as const;

export default function WhatSmuaiDoesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <section aria-labelledby="activities-heading" className="bg-white px-5 py-5 text-brand-deep-blue sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-start gap-3 sm:gap-8 md:grid-cols-[1fr_1.1fr] md:gap-10 lg:gap-16">
          <div className="min-w-0">
            <div className="mb-3 sm:mb-5 lg:mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] sm:text-sm text-brand-slate">In action</p>
              <h2 id="activities-heading" className="mt-1 text-2xl font-black tracking-tight sm:mt-3 sm:text-5xl">What SMUAI Does</h2>
            </div>
            <div role="tablist" aria-label="Explore SMUAI activities" className="mb-3 grid grid-cols-4 sm:mb-6 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
              {activities.map((activity, index) => (
                <button
                  key={activity.id}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  id={`activity-tab-${activity.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls={`activity-panel-${activity.id}`}
                  tabIndex={activeIndex === index ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => {
                    let nextIndex: number;
                    if (event.key === "ArrowRight") nextIndex = (index + 1) % activities.length;
                    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + activities.length) % activities.length;
                    else if (event.key === "Home") nextIndex = 0;
                    else if (event.key === "End") nextIndex = activities.length - 1;
                    else return;
                    event.preventDefault();
                    setActiveIndex(nextIndex);
                    tabRefs.current[nextIndex]?.focus();
                  }}
                  className={`min-h-11 min-w-0 whitespace-nowrap rounded-full border px-1 py-2.5 text-[10px] min-[375px]:text-[11px] min-[420px]:text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue sm:px-4 sm:text-sm ${activeIndex === index ? "border-brand-gold bg-brand-gold text-brand-deep-blue" : "border-brand-soft bg-white text-brand-slate hover:border-brand-deep-blue/30 hover:text-brand-deep-blue"}`}
                >
                  {activity.title}
                </button>
              ))}
            </div>
            {activities.map((activity, index) => (
              <div key={activity.id} id={`activity-panel-${activity.id}`} role="tabpanel" aria-labelledby={`activity-tab-${activity.id}`} hidden={activeIndex !== index} tabIndex={0} className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue">
                <h3 className="hidden text-2xl font-black leading-tight tracking-tight sm:block sm:text-3xl">{activity.headline}</h3>
                <p className="mt-0 text-sm leading-relaxed text-brand-slate sm:mt-4 sm:text-base">{activity.description}</p>
                <div className="mt-3 border-t border-brand-deep-blue/15 pt-3 sm:mt-6 sm:pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-slate">Featured · {activity.title}</p>
                  <h4 className="mt-1 text-sm font-bold leading-snug sm:mt-2 sm:text-base">{activity.example}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-brand-slate sm:mt-2 sm:text-sm">{activity.detail}</p>
                </div>
                <Link href="/events" className="mt-1 inline-flex min-h-11 sm:mt-5 items-center gap-2 rounded-md text-sm font-bold underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-slate focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue">
                  Explore our events <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mx-auto w-full min-w-0 max-w-[560px]">
            <div className="relative mx-3 mb-6 mt-1 grid sm:mx-6 sm:mb-10 sm:mt-3">
              {activities.map((activity, index) => {
                const depth = (index - activeIndex + activities.length) % activities.length;
                return (
                  <motion.figure
                    key={activity.id}
                    aria-hidden={depth !== 0}
                    initial={false}
                    animate={{ rotate: depth === 0 ? 0 : depth % 2 === 0 ? -5 : 5, y: depth * 9, scale: 1 - depth * 0.035 }}
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 25 }}
                    style={{ zIndex: activities.length - depth, transformOrigin: "50% 85%" }}
                    className="relative col-start-1 row-start-1 flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-brand-soft bg-white p-2.5 shadow-[0_18px_35px_-20px_rgba(27,43,84,0.4)] sm:rounded-[2rem] sm:p-3"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1rem] bg-brand-cloud sm:rounded-[1.4rem]">
                      <Image src={activity.image} alt={activity.alt} fill sizes="(min-width: 1264px) 580px, (min-width: 768px) 50vw, 90vw" className={activity.id === "research" ? "object-cover object-[center_40%]" : "object-cover"} />
                    </div>
                    <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 sm:px-3 sm:pb-2 sm:pt-4">
                      <span className="text-sm font-bold sm:text-base">{activity.title}</span>
                      <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-bold">0{index + 1} / 04</span>
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
            <div className="hidden items-center justify-center gap-4 sm:flex">
              <button type="button" aria-label="Previous activity" onClick={() => setActiveIndex((index) => (index - 1 + activities.length) % activities.length)} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-soft hover:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue"><ArrowLeft size={18} /></button>
              <span className="text-xs font-semibold text-brand-slate">Explore the stack</span>
              <button type="button" aria-label="Next activity" onClick={() => setActiveIndex((index) => (index + 1) % activities.length)} className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-soft hover:bg-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
