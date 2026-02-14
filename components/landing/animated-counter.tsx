"use client";

import { memo, useReducer, useLayoutEffect, useRef, useCallback } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

type CounterState = { value: number };
type CounterAction = { type: "SET"; value: number };

function counterReducer(_state: CounterState, action: CounterAction): CounterState {
  return { value: action.value };
}

function AnimatedCounterComponent({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [state, dispatch] = useReducer(counterReducer, { value: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameRef = useRef<number>(0);

  const animate = useCallback(() => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = end * easeOutQuart;

      dispatch({ type: "SET", value: currentCount });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [end, duration]);

  useLayoutEffect(() => {
    if (hasAnimatedRef.current) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasAnimatedRef.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  const displayValue = decimals > 0 ? state.value.toFixed(decimals) : Math.floor(state.value);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export const AnimatedCounter = memo(AnimatedCounterComponent);
AnimatedCounter.displayName = "AnimatedCounter";
