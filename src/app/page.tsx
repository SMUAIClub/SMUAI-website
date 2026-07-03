import HeroSection from "@/components/home/hero-section";
import MissionVisionSection from "@/components/home/mission-vision-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import WhatSmuaiDoesSection from "@/components/home/what-smuai-does-section";

export default function HomePage() {
  return (
    <div className="relative w-full sm:left-1/2 sm:w-screen sm:-translate-x-1/2">
      <HeroSection />
      <MissionVisionSection />
      <WhatSmuaiDoesSection />
      <TestimonialsSection />
    </div>
  );
}
