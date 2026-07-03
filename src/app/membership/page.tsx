import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, Mail, UserRound } from "lucide-react";

const steps = [
  {
    title: "Create your Opine account",
    description: "Create your Opine account through smu.opine.asia using your SMU email address so your membership can be tied to your student identity.",
    icon: Mail,
  },
  {
    title: "Complete the membership form",
    description: "Fill in your details accurately and submit the required information for SMUAI membership registration.",
    icon: UserRound,
  },
  {
    title: "Pay the S$15 lifetime membership fee",
    description: "The membership fee is a one-time S$15 payment for lifetime membership in SMUAI, paid via PayNow.",
    icon: CreditCard,
  },
  {
    title: "Wait for the confirmation email",
    description: "Once your submission is reviewed, you will receive an email confirming your membership status.",
    icon: CheckCircle2,
  },
];

export default function MembershipPage() {
  return (
    <div className="relative w-full sm:left-1/2 sm:w-screen sm:-translate-x-1/2">
      <section className="bg-white px-5 py-8 text-brand-deep-blue lg:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="w-full max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Membership</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue max-sm:max-w-[10ch] max-sm:text-[2.15rem] max-sm:leading-[0.98] sm:text-4xl">
              Join SMUAI as a Member
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-slate max-sm:max-w-[21rem] sm:text-lg">
              Becoming a member gives you a direct way to stay connected with the club and officially be part of the
              SMUAI community. Before opening the registration form, follow the steps below.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-brand-cloud p-6 shadow-[0_24px_40px_-34px_rgba(27,43,84,0.28)] sm:p-7">
              <h2 className="text-xl font-bold text-brand-deep-blue">What to do</h2>
              <div className="mt-6 space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl bg-white px-4 py-4 shadow-[0_18px_35px_-30px_rgba(27,43,84,0.24)]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-pale-gold text-brand-deep-blue">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-slate">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-brand-deep-blue">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-brand-slate">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-brand-soft bg-white p-6 shadow-[0_24px_40px_-34px_rgba(27,43,84,0.28)] sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-slate">Before You Start</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-brand-deep-blue">
                Membership Registration Checklist
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-brand-slate">
                <p>
                  Create your Opine account first through{" "}
                  <a
                    href="https://smu.opine.asia/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-brand-deep-blue underline underline-offset-4"
                  >
                    smu.opine.asia
                  </a>
                  .
                </p>
                <p>Prepare your basic student details so the form can be completed smoothly.</p>
                <p>Be ready to make the S$15 one-time lifetime membership payment via PayNow.</p>
                <p>After submission, keep an eye on your inbox for the membership confirmation email.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://smu.opine.asia/survey?id=88173c31-3ce0-419d-a811-72783811d5df"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep-blue/90"
                >
                  Open Registration Form
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/team"
                  className="inline-flex items-center justify-center rounded-full border border-brand-soft px-5 py-3 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-cloud"
                >
                  Meet The Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
