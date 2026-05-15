"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ElementType, ReactNode } from "react";

type TextFadeInUpProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

export function TextFadeInUp({
  as = "div",
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  ...props
}: TextFadeInUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion.create(as);

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
      {...props}
    >
      {children}
    </MotionTag>
  );
}
