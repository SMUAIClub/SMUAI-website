"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 44,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: distance, scale: 0.985, filter: "blur(8px)" }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: reduceMotion ? "auto" : "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
