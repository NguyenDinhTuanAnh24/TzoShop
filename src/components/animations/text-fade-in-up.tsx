"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type TextFadeInUpProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "section" | "article";
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
};

const motionMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

export function TextFadeInUp({
  as = "div",
  children,
  className,
  id,
  delay = 0,
  duration = 0.6,
  once = true,
}: TextFadeInUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motionMap[as];

  return (
    <MotionTag
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      id={id}
    >
      {children}
    </MotionTag>
  );
}
