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
      className="h-[320px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[640px]"
    />
  );
}

export const HeroCarousel = memo(HeroCarouselComponent);
HeroCarousel.displayName = "HeroCarousel";
