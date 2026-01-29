"use client";

import { memo, useCallback } from "react";
import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

function getScrollState() {
  if (typeof window === "undefined") return false;
  return window.scrollY > 500;
}

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getSnapshot() {
  return getScrollState();
}

function getServerSnapshot() {
  return false;
}

function BackToTopComponent() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

export const BackToTop = memo(BackToTopComponent);
BackToTop.displayName = "BackToTop";
