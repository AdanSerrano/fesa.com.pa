"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  id?: string;
}

function SpotlightComponent({ className, id = "spotlight" }: SpotlightProps) {
  const gradientRef = useRef<SVGRadialGradientElement>(null);

  const containerRefCallback = useCallback(
    (node: SVGSVGElement | null) => {
      if (!node) return;
      const section = node.closest("section");
      if (!section) return;

      const handler = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        gradientRef.current?.setAttribute("cx", `${x}%`);
        gradientRef.current?.setAttribute("cy", `${y}%`);
      };

      section.addEventListener("mousemove", handler, { passive: true });
    },
    []
  );

  return (
    <svg
      ref={containerRefCallback}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id={`${id}-grad`}
          ref={gradientRef}
          cx="50%"
          cy="50%"
          r="35%"
        >
          <stop offset="0%" stopColor="rgba(59,130,246,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-grad)`}
      />
    </svg>
  );
}

SpotlightComponent.displayName = "Spotlight";

export const Spotlight = SpotlightComponent;
