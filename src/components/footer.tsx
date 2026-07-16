import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CalendarDays, Github, Instagram, Linkedin, Mail, Send } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

const socialLinks = [
  {
    href: "https://linkedin.com/company/smuai",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://www.instagram.com/smu.ai/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://t.me/SmuAI",
    label: "Telegram",
    icon: Send,
  },
  {
    href: "https://github.com/SMUAIClub",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://luma.com/user/smuai",
    label: "Luma",
    icon: CalendarDays,
  },
];

export default function Footer() {
  return (
    <footer className="bg-brand-deep-blue text-white">
      <div className="bg-[#e7ecf3] px-5 py-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-[920px] flex-col items-center text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-slate">Membership</p>
          <h2 className="mt-3 max-w-2xl text-[2rem] font-black tracking-tight text-brand-deep-blue sm:text-[2.35rem] sm:leading-[1.02]">
            Lifetime membership at only S$15.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-slate sm:text-base">
            Get updates on events, workshops, hackathons, and member opportunities with a one-time sign-up.
          </p>
          <div className="mt-5 w-full max-w-sm">
            <Link
              href="/membership"
              style={
                {
                  "--spread": "90deg",
                  "--shimmer-color": "rgba(255,255,255,0.45)",
                  "--radius": "999px",
                  "--speed": "3.2s",
                  "--cut": "0.05em",
                  "--bg": "#22376b",
                } as CSSProperties
              }
              className="group relative z-0 flex min-h-11 w-full items-center justify-center overflow-hidden rounded-full border border-brand-deep-blue/15 bg-brand-deep-blue px-6 py-3 whitespace-nowrap text-white shadow-[0_16px_34px_-22px_rgba(27,43,84,0.34)] transition-transform duration-300 ease-in-out active:translate-y-px"
            >
              <div className="-z-30 absolute inset-0 overflow-visible blur-[2px]">
                <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-full rounded-none [mask:none]">
                  <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
                </div>
              </div>
              <span className="relative z-10 text-sm font-semibold text-white">Join SMUAI as a Member</span>
              <div className="absolute inset-0 size-full rounded-full shadow-[inset_0_-8px_10px_rgba(255,255,255,0.12)] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_rgba(255,255,255,0.2)] group-active:shadow-[inset_0_-10px_10px_rgba(255,255,255,0.2)]" />
              <div className="absolute inset-[var(--cut)] -z-20 rounded-full bg-[var(--bg)]" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid w-full gap-8 px-5 py-9 sm:gap-10 sm:px-6 sm:py-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12 lg:px-12 lg:py-12 xl:px-16">
        <div className="text-center lg:justify-self-start lg:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Get in Touch</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-white/60">Email:</p>
            <a
              href="mailto:smuai@sa.smu.edu.sg"
              className="inline-flex items-center gap-2 text-base font-medium text-white transition-colors hover:text-brand-gold"
            >
              <Mail size={16} />
              <span className="break-all sm:break-normal">smuai@sa.smu.edu.sg</span>
            </a>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Follow Us On</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-brand-gold hover:bg-white/12"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:justify-self-center">
          <div className="w-full max-w-sm text-center">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Shortcuts</h3>
            <ul className="mt-5 flex flex-nowrap items-center justify-center gap-4 text-sm sm:mx-auto sm:max-w-[18rem] sm:gap-5 sm:text-base lg:grid lg:grid-cols-1 lg:gap-y-3 lg:text-base">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-base font-medium text-white transition-colors hover:text-brand-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center pt-1 lg:justify-self-end lg:pt-0">
          <Image
            src="/brand/smuai_lion_logo.png"
            alt="SMUAI"
            width={280}
            height={280}
            className="h-auto w-[132px] object-contain sm:w-[170px] lg:w-[240px]"
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="flex w-full flex-col gap-2 px-5 py-5 text-center text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-12 xl:px-16">
          <p>© {new Date().getFullYear()} SMUAI. All rights reserved.</p>
          <p>Singapore Management University</p>
        </div>
      </div>
    </footer>
  );
}
