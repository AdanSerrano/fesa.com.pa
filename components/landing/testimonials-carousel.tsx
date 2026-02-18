"use client";

import { memo } from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  company: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

function TestimonialsCarouselComponent({
  testimonials,
}: TestimonialsCarouselProps) {
  return <AnimatedTestimonials testimonials={testimonials} autoplay autoplayInterval={5000} />;
}

export const TestimonialsCarousel = memo(TestimonialsCarouselComponent);
TestimonialsCarousel.displayName = "TestimonialsCarousel";
