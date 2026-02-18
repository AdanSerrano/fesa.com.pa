"use client";

import { memo, useMemo } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef } from "react";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

function TextGenerateEffectComponent({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate();
  const { ref, hasBeenInView } = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const hasAnimatedRef = useRef(false);

  const wordsArray = useMemo(() => words.split(" "), [words]);

  useLayoutEffect(() => {
    if (hasBeenInView && !hasAnimatedRef.current && scope.current) {
      hasAnimatedRef.current = true;
      animate(
        "span",
        { opacity: 1, filter: filter ? "blur(0px)" : "none" },
        { duration, delay: stagger(0.05) }
      );
    }
  }, [hasBeenInView, animate, filter, duration, scope]);

  return (
    <div className={cn("font-normal", className)} ref={ref}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="opacity-0 inline-block"
            style={filter ? { filter: "blur(10px)" } : {}}
          >
            {word}
            {idx < wordsArray.length - 1 && <>&nbsp;</>}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export const TextGenerateEffect = memo(TextGenerateEffectComponent);
TextGenerateEffect.displayName = "TextGenerateEffect";
