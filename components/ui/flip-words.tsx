"use client";

import { memo, useCallback, useLayoutEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

interface FlipState {
  currentIndex: number;
  isAnimating: boolean;
}

type FlipAction =
  | { type: "NEXT"; total: number }
  | { type: "SET_ANIMATING"; value: boolean };

function flipReducer(state: FlipState, action: FlipAction): FlipState {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        isAnimating: true,
        currentIndex: (state.currentIndex + 1) % action.total,
      };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.value };
    default:
      return state;
  }
}

function FlipWordsComponent({ words, duration = 3000, className }: FlipWordsProps) {
  const [state, dispatch] = useReducer(flipReducer, {
    currentIndex: 0,
    isAnimating: false,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      dispatch({ type: "NEXT", total: words.length });
    }, duration);
  }, [words.length, duration]);

  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      startTimer();
      return;
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const handleAnimationComplete = useCallback(() => {
    dispatch({ type: "SET_ANIMATING", value: false });
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimer();
  }, [startTimer]);

  const currentWord = words[state.currentIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        onAnimationComplete={handleAnimationComplete}
        className={cn("inline-block", className)}
      >
        {currentWord.split(" ").map((word, wordIndex) => (
          <motion.span
            key={`${currentWord}-${wordIndex}`}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: wordIndex * 0.08,
              duration: 0.3,
            }}
            className="inline-block whitespace-nowrap"
          >
            {word}
            {wordIndex < currentWord.split(" ").length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

export const FlipWords = memo(FlipWordsComponent);
FlipWords.displayName = "FlipWords";
