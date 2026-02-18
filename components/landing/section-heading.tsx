"use client";

import { memo } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface SectionHeadingProps {
  text: string;
  className?: string;
}

function SectionHeadingComponent({ text, className }: SectionHeadingProps) {
  return (
    <TextGenerateEffect
      words={text}
      className={className ?? "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"}
      duration={0.4}
    />
  );
}

export const SectionHeading = memo(SectionHeadingComponent);
SectionHeading.displayName = "SectionHeading";
