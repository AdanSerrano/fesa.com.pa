"use client";

import { memo } from "react";
import { FlipWords } from "@/components/ui/flip-words";

interface HeroFlipWordsProps {
  words: string[];
}

function HeroFlipWordsComponent({ words }: HeroFlipWordsProps) {
  return <FlipWords words={words} duration={3000} className="text-primary" />;
}

export const HeroFlipWords = memo(HeroFlipWordsComponent);
HeroFlipWords.displayName = "HeroFlipWords";
