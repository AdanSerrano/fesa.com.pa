"use client";
import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const TOOLTIP_WIDTH = 240;
const TOOLTIP_OFFSET = 12;
const TOUCH_HIDE_DELAY = 2000;

interface TooltipState {
  isVisible: boolean;
  mouse: { x: number; y: number };
  position: { x: number; y: number };
  height: number;
}

const initialState: TooltipState = {
  isVisible: false,
  mouse: { x: 0, y: 0 },
  position: { x: 0, y: 0 },
  height: 0,
};

export const Tooltip = memo(function Tooltip({
  content,
  children,
  containerClassName,
}: {
  content: string | React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}) {
  const [state, setState] = useState<TooltipState>(initialState);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = useCallback((mouseX: number, mouseY: number): { x: number; y: number } => {
    if (!contentRef.current || !containerRef.current) {
      return { x: mouseX + TOOLTIP_OFFSET, y: mouseY + TOOLTIP_OFFSET };
    }

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipHeight = contentRef.current.scrollHeight;

    const absoluteX = containerRect.left + mouseX;
    const absoluteY = containerRect.top + mouseY;

    let finalX = mouseX + TOOLTIP_OFFSET;
    let finalY = mouseY + TOOLTIP_OFFSET;

    if (absoluteX + TOOLTIP_OFFSET + TOOLTIP_WIDTH > viewportWidth) {
      finalX = mouseX - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
    }

    if (absoluteX + finalX < 0) {
      finalX = -containerRect.left + TOOLTIP_OFFSET;
    }

    if (absoluteY + TOOLTIP_OFFSET + tooltipHeight > viewportHeight) {
      finalY = mouseY - tooltipHeight - TOOLTIP_OFFSET;
    }

    if (absoluteY + finalY < 0) {
      finalY = -containerRect.top + TOOLTIP_OFFSET;
    }

    return { x: finalX, y: finalY };
  }, []);

  const updateState = useCallback((mouseX: number, mouseY: number, visible: boolean) => {
    setState(prev => {
      const newPosition = calculatePosition(mouseX, mouseY);
      const newHeight = contentRef.current?.scrollHeight ?? prev.height;
      return {
        isVisible: visible,
        mouse: { x: mouseX, y: mouseY },
        position: newPosition,
        height: newHeight,
      };
    });
  }, [calculatePosition]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    updateState(mouseX, mouseY, true);
  }, [updateState]);

  const handleMouseLeave = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setState(prev => {
      if (!prev.isVisible) return prev;
      const newPosition = calculatePosition(mouseX, mouseY);
      return {
        ...prev,
        mouse: { x: mouseX, y: mouseY },
        position: newPosition,
      };
    });
  }, [calculatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;
    updateState(mouseX, mouseY, true);
  }, [updateState]);

  const handleTouchEnd = useCallback(() => {
    touchTimeoutRef.current = setTimeout(() => {
      resetState();
      touchTimeoutRef.current = null;
    }, TOUCH_HIDE_DELAY);
  }, [resetState]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      setState(prev => {
        if (prev.isVisible) {
          return initialState;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newPosition = calculatePosition(mouseX, mouseY);
        const newHeight = contentRef.current?.scrollHeight ?? 0;
        return {
          isVisible: true,
          mouse: { x: mouseX, y: mouseY },
          position: newPosition,
          height: newHeight,
        };
      });
    }
  }, [calculatePosition]);

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {state.isVisible && (
          <motion.div
            key={String(state.isVisible)}
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: state.height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="pointer-events-none absolute z-50 min-w-[15rem] overflow-hidden rounded-md border border-transparent bg-white shadow-sm ring-1 shadow-black/5 ring-black/5 dark:bg-neutral-900 dark:shadow-white/10 dark:ring-white/5"
            style={{
              top: state.position.y,
              left: state.position.x,
            }}
          >
            <div
              ref={contentRef}
              className="p-2 text-sm text-neutral-600 md:p-4 dark:text-neutral-400"
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
