"use client";

import { memo } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";

interface HeroCarouselProps {
  images: {
    src: string;
    title: string;
    subtitle: string;
    alt: string;
  }[];
}

function HeroCarouselComponent({ images }: HeroCarouselProps) {
  return (
    <ImagesSlider
      images={images}
      autoplay
      autoplayInterval={5000}
      className="h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh]"
    />
  );
}

export const HeroCarousel = memo(HeroCarouselComponent);
HeroCarousel.displayName = "HeroCarousel";
