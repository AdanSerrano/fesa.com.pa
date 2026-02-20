"use client";

import {
  memo,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageSlide {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
}

interface ImagesSliderProps {
  images: ImageSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
}

interface SliderState {
  active: number;
}

type SliderAction =
  | { type: "NEXT"; total: number }
  | { type: "PREV"; total: number }
  | { type: "GO_TO"; index: number };

function sliderReducer(state: SliderState, action: SliderAction): SliderState {
  switch (action.type) {
    case "NEXT":
      return { active: (state.active + 1) % action.total };
    case "PREV":
      return { active: (state.active - 1 + action.total) % action.total };
    case "GO_TO":
      return { active: action.index };
    default:
      return state;
  }
}

const SWIPE_THRESHOLD = 50;

function ImagesSliderComponent({
  images,
  autoplay = true,
  autoplayInterval = 5000,
  className,
}: ImagesSliderProps) {
  const [state, dispatch] = useReducer(sliderReducer, { active: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    dispatch({ type: "NEXT", total: images.length });
  }, [images.length]);

  const handlePrev = useCallback(() => {
    dispatch({ type: "PREV", total: images.length });
  }, [images.length]);

  const handleGoTo = useCallback((index: number) => {
    dispatch({ type: "GO_TO", index });
  }, []);

  const resetAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoplay) {
      timerRef.current = setInterval(handleNext, autoplayInterval);
    }
  }, [autoplay, autoplayInterval, handleNext]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    resetAutoplay();
    return stopAutoplay;
  }, [resetAutoplay, stopAutoplay]);

  const onDotClick = useCallback(
    (index: number) => {
      handleGoTo(index);
      resetAutoplay();
    },
    [handleGoTo, resetAutoplay]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      stopAutoplay();
    },
    [stopAutoplay]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartRef.current;
      touchStartRef.current = null;

      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
        if (delta < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      resetAutoplay();
    },
    [handleNext, handlePrev, resetAutoplay]
  );

  const activeImage = images[state.active];

  if (!activeImage) return null;

  return (
    <div
      className={cn("relative w-full overflow-hidden touch-pan-y", className)}
      onMouseEnter={stopAutoplay}
      onMouseLeave={resetAutoplay}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((image, index) => (
        <div
          key={image.src}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            index === state.active
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-black/55 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 sm:px-12 pointer-events-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`text-${state.active}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-4xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              {activeImage.title}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto font-light drop-shadow-md">
              {activeImage.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            onClick={() => onDotClick(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              index === state.active
                ? "w-8 bg-white shadow-lg"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export const ImagesSlider = memo(ImagesSliderComponent);
ImagesSlider.displayName = "ImagesSlider";
