"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface LampProps {
  children: ReactNode;
  className?: string;
}

function LampComponent({ children, className }: LampProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={cn("relative flex flex-col items-center", className)}>
      <div className="relative w-full flex justify-center overflow-hidden">
        <motion.div
          className="absolute top-0 h-48 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 0%, transparent 0%, var(--brand-500) 50%, transparent 100%)",
            filter: "blur(0px)",
          }}
          initial={{ width: "15rem", opacity: 0 }}
          animate={isInView ? { width: "30rem", opacity: 0.6 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 h-48 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 0%, transparent 0%, var(--brand-400) 50%, transparent 100%)",
            filter: "blur(12px)",
          }}
          initial={{ width: "15rem", opacity: 0 }}
          animate={isInView ? { width: "30rem", opacity: 0.3 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="absolute top-[11.5rem] h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 320, opacity: 0.6 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <div className="relative z-10 pt-32">{children}</div>
    </div>
  );
}

LampComponent.displayName = "Lamp";

export const Lamp = LampComponent;
