import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Mail, Send } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/partners", label: "Partners" },
];

const socialLinks = [
  {
    href: "https://linkedin.com/company/smuai",
    value: "linkedin.com/company/smuai",
    icon: Linkedin,
  },
  {
    href: "https://www.instagram.com/smu.ai/",
    value: "@smu.ai",
    icon: Instagram,
  },
  {
    href: "https://t.me/SmuAI",
    value: "t.me/SmuAI",
    icon: Send,
  },
  {
    href: "mailto:smuai@sa.smu.edu.sg",
    value: "smuai@sa.smu.edu.sg",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-deep-blue text-white">
      <div className="grid w-full gap-10 px-5 py-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-12 lg:px-12 xl:px-16">
        <div className="lg:justify-self-start">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Shortcuts</h3>
          <ul className="mt-5 space-y-3">
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

          <a
            href="https://smu.opine.asia/survey?id=88173c31-3ce0-419d-a811-72783811d5df"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-deep-blue transition hover:brightness-105"
          >
            Join as a Member
          </a>
        </div>

        <div className="lg:justify-self-center">
          <div>
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.18em] text-white/60">
              Social
            </h3>
            <div className="mx-auto mt-5 grid w-full max-w-md gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.value}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-left text-white transition hover:border-brand-gold hover:bg-white/12"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                      <Icon size={16} />
                    </span>
                    <span className="truncate text-sm font-medium text-white/80">{item.value}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-self-end">
          <Image
            src="/brand/smuai_lion_logo.png"
            alt="SMUAI"
            width={280}
            height={280}
            className="h-auto w-[190px] object-contain sm:w-[220px] lg:w-[240px]"
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="flex w-full flex-col gap-2 px-5 py-5 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between lg:px-12 xl:px-16">
          <p>© {new Date().getFullYear()} SMUAI. All rights reserved.</p>
          <p>Singapore Management University</p>
        </div>
      </div>
    </footer>
  );
}
