import HeroSection from "@/components/home/hero-section";
import MissionVisionSection from "@/components/home/mission-vision-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import WhatSmuaiDoesSection from "@/components/home/what-smuai-does-section";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function HomePage() {
  return (
    <div className="relative w-full overflow-x-clip">
      <HeroSection />
      <ScrollReveal>
        <MissionVisionSection />
      </ScrollReveal>
      <ScrollReveal delay={0.06}>
        <WhatSmuaiDoesSection />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <TestimonialsSection />
      </ScrollReveal>
    </div>
  );
}
