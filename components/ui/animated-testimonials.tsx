"use client";

import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  company: string;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number;
}

interface TestimonialState {
  active: number;
}

type TestimonialAction =
  | { type: "NEXT"; total: number }
  | { type: "PREV"; total: number };

function testimonialReducer(
  state: TestimonialState,
  action: TestimonialAction
): TestimonialState {
  switch (action.type) {
    case "NEXT":
      return { active: (state.active + 1) % action.total };
    case "PREV":
      return { active: (state.active - 1 + action.total) % action.total };
    default:
      return state;
  }
}

function AnimatedTestimonialsComponent({
  testimonials,
  autoplay = true,
  autoplayInterval = 5000,
}: AnimatedTestimonialsProps) {
  const [state, dispatch] = useReducer(testimonialReducer, { active: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleNext = useCallback(() => {
    dispatch({ type: "NEXT", total: testimonials.length });
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    dispatch({ type: "PREV", total: testimonials.length });
  }, [testimonials.length]);

  useLayoutEffect(() => {
    if (autoplay) {
      timerRef.current = setInterval(handleNext, autoplayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayInterval, handleNext]);

  const activeTestimonial = useMemo(
    () => testimonials[state.active],
    [testimonials, state.active]
  );

  const rotations = useMemo(
    () => testimonials.map((_, i) => ((i * 7 + 3) % 21) - 10),
    [testimonials]
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-5xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <div className="relative h-64 w-full sm:h-80">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotations[index],
                  }}
                  animate={{
                    opacity: index === state.active ? 1 : 0.7,
                    scale: index === state.active ? 1 : 0.95,
                    z: index === state.active ? 0 : -100,
                    rotate: index === state.active ? 0 : rotations[index],
                    zIndex:
                      index === state.active
                        ? 40
                        : testimonials.length + 2 - index,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotations[index],
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="h-full w-full rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <span className="text-6xl font-black text-primary/20">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={state.active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              {activeTestimonial.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeTestimonial.designation} · {activeTestimonial.company}
            </p>
            <motion.p
              key={`quote-${state.active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
            >
              &ldquo;{activeTestimonial.quote.split(" ").map((word, index) => (
                <motion.span
                  key={`${state.active}-${index}`}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}&rdquo;
            </motion.p>
          </motion.div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={handlePrev}
              className="group/btn flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary/10"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground transition-colors group-hover/btn:text-primary" />
            </button>
            <button
              onClick={handleNext}
              className="group/btn flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-primary/10"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover/btn:text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const AnimatedTestimonials = memo(AnimatedTestimonialsComponent);
AnimatedTestimonials.displayName = "AnimatedTestimonials";
