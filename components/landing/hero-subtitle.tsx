"use client";

import { memo } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

interface HeroSubtitleProps {
  text: string;
}

function HeroSubtitleComponent({ text }: HeroSubtitleProps) {
  return (
    <TextGenerateEffect
      words={text}
      className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-foreground/70 lg:text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
      duration={0.4}
    />
  );
}

export const HeroSubtitle = memo(HeroSubtitleComponent);
HeroSubtitle.displayName = "HeroSubtitle";
