import { motion, MotionProps, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollRevealProps extends MotionProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  distance?: number;
}

const offsets: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  fade: {},
  scale: { scale: 0.92 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.2,
  distance,
  ...rest
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();
  const initial = prefersReduced
    ? { opacity: 0 }
    : {
        opacity: 0,
        ...offsets[direction],
        ...(distance && (direction === "up" || direction === "down")
          ? { y: direction === "up" ? distance : -distance }
          : {}),
        ...(distance && (direction === "left" || direction === "right")
          ? { x: direction === "left" ? distance : -distance }
          : {}),
      };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
