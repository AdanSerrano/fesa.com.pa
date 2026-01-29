"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSyncExternalStore } from "react";
import type { CatalogPage } from "../types/catalogs.types";

interface ViewerState {
  currentSpread: number;
  isFlipping: boolean;
  flipDirection: "next" | "prev" | null;
  targetSpread: number;
}

type StoreListener = () => void;

function createViewerStore(initialSpread: number, maxSpread: number) {
  let state: ViewerState = {
    currentSpread: initialSpread,
    isFlipping: false,
    flipDirection: null,
    targetSpread: initialSpread,
  };

  const listeners = new Set<StoreListener>();

  const notify = () => {
    listeners.forEach((l) => l());
  };

  return {
    subscribe: (listener: StoreListener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => state,
    startFlip: (direction: "next" | "prev") => {
      if (state.isFlipping) return false;

      const newSpread =
        direction === "next"
          ? Math.min(state.currentSpread + 1, maxSpread)
          : Math.max(state.currentSpread - 1, 0);

      if (newSpread === state.currentSpread) return false;

      state = {
        ...state,
        isFlipping: true,
        flipDirection: direction,
        targetSpread: newSpread,
      };
      notify();
      return true;
    },
    endFlip: () => {
      if (!state.isFlipping) return;
      state = {
        currentSpread: state.targetSpread,
        isFlipping: false,
        flipDirection: null,
        targetSpread: state.targetSpread,
      };
      notify();
    },
    goTo: (spread: number) => {
      if (state.isFlipping) return;
      const clamped = Math.max(0, Math.min(spread, maxSpread));
      if (clamped === state.currentSpread) return;
      state = { ...state, currentSpread: clamped, targetSpread: clamped };
      notify();
    },
  };
}

interface Labels {
  page: string;
  of: string;
  previous: string;
  next: string;
  fullscreen: string;
  exitFullscreen: string;
  zoomIn: string;
  zoomOut: string;
}

interface CatalogViewerProps {
  pages: CatalogPage[];
  labels: Labels;
}

interface Spread {
  leftPage: CatalogPage | null;
  rightPage: CatalogPage | null;
  isSingle: boolean;
}

function buildSpreads(pages: CatalogPage[]): Spread[] {
  if (pages.length === 0) return [];

  const spreads: Spread[] = [];
  spreads.push({ leftPage: null, rightPage: pages[0], isSingle: true });

  for (let i = 1; i < pages.length; i += 2) {
    const left = pages[i];
    const right = pages[i + 1] || null;

    if (i === pages.length - 1) {
      spreads.push({ leftPage: left, rightPage: null, isSingle: true });
    } else {
      spreads.push({ leftPage: left, rightPage: right, isSingle: false });
    }
  }

  return spreads;
}

interface PageImageProps {
  src: string;
  alt: string;
}

const PageImage = memo(function PageImage({ src, alt }: PageImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      priority
      sizes="(max-width: 768px) 100vw, 900px"
    />
  );
});
PageImage.displayName = "PageImage";

interface PreloadImageProps {
  src: string;
}

const PreloadImage = memo(function PreloadImage({ src }: PreloadImageProps) {
  return (
    <Image
      src={src}
      alt=""
      width={1}
      height={1}
      className="absolute opacity-0 pointer-events-none"
      priority
    />
  );
});
PreloadImage.displayName = "PreloadImage";

interface ThumbnailProps {
  src: string;
  isActive: boolean;
  onClick: () => void;
}

const Thumbnail = memo(function Thumbnail({
  src,
  isActive,
  onClick,
}: ThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-12 h-16 rounded border-2 overflow-hidden transition-all duration-200 flex-shrink-0",
        isActive
          ? "border-primary scale-110 shadow-md"
          : "border-transparent opacity-50 hover:opacity-100"
      )}
    >
      <Image src={src} alt="" fill className="object-cover" sizes="48px" />
    </button>
  );
});
Thumbnail.displayName = "Thumbnail";

interface SpreadViewProps {
  spread: Spread;
  className?: string;
}

const SpreadView = memo(function SpreadView({
  spread,
  className,
}: SpreadViewProps) {
  if (spread.isSingle) {
    const page = spread.rightPage || spread.leftPage;
    if (!page) return null;
    return (
      <div className={cn("absolute inset-0", className)}>
        <PageImage src={page.imageUrl} alt={page.alt || ""} />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 grid grid-cols-2", className)}>
      <div className="relative">
        {spread.leftPage && (
          <PageImage
            src={spread.leftPage.imageUrl}
            alt={spread.leftPage.alt || ""}
          />
        )}
        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      </div>
      <div className="relative">
        {spread.rightPage && (
          <PageImage
            src={spread.rightPage.imageUrl}
            alt={spread.rightPage.alt || ""}
          />
        )}
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
      </div>
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-r from-black/20 via-black/30 to-black/20 pointer-events-none" />
    </div>
  );
});
SpreadView.displayName = "SpreadView";

interface FlipPageProps {
  frontSrc: string;
  backSrc: string | null;
  direction: "next" | "prev";
  onAnimationEnd: () => void;
}

const FlipPage = memo(function FlipPage({
  frontSrc,
  backSrc,
  direction,
  onAnimationEnd,
}: FlipPageProps) {
  const isNext = direction === "next";

  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-1/2 z-10",
        isNext
          ? "right-0 origin-left animate-flip-to-left"
          : "left-0 origin-right animate-flip-to-right"
      )}
      style={{ transformStyle: "preserve-3d" }}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        className="absolute inset-0 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl"
        style={{ backfaceVisibility: "hidden" }}
      >
        <PageImage src={frontSrc} alt="" />
        <div
          className={cn(
            "absolute inset-y-0 w-16 pointer-events-none",
            isNext
              ? "left-0 bg-gradient-to-r from-black/20 to-transparent"
              : "right-0 bg-gradient-to-l from-black/20 to-transparent"
          )}
        />
      </div>

      {backSrc && (
        <div
          className="absolute inset-0 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            transform: isNext ? "rotateY(180deg)" : "rotateY(-180deg)",
          }}
        >
          <PageImage src={backSrc} alt="" />
          <div
            className={cn(
              "absolute inset-y-0 w-16 pointer-events-none",
              isNext
                ? "right-0 bg-gradient-to-l from-black/20 to-transparent"
                : "left-0 bg-gradient-to-r from-black/20 to-transparent"
            )}
          />
        </div>
      )}
    </div>
  );
});
FlipPage.displayName = "FlipPage";

function CatalogViewerComponent({ pages, labels }: CatalogViewerProps) {
  const spreads = useMemo(() => buildSpreads(pages), [pages]);

  const storeRef = useRef<ReturnType<typeof createViewerStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createViewerStore(0, spreads.length - 1);
  }
  const store = storeRef.current;

  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  const touchStartX = useRef<number | null>(null);

  const currentSpreadData = spreads[state.currentSpread];
  const targetSpreadData = spreads[state.targetSpread];
  const nextSpreadData = spreads[state.currentSpread + 1];
  const prevSpreadData = spreads[state.currentSpread - 1];

  const displaySpread = state.isFlipping ? targetSpreadData : currentSpreadData;

  const canPrev = state.currentSpread > 0 && !state.isFlipping;
  const canNext = state.currentSpread < spreads.length - 1 && !state.isFlipping;

  const handlePrev = useCallback(() => store.startFlip("prev"), [store]);
  const handleNext = useCallback(() => store.startFlip("next"), [store]);
  const handleFlipEnd = useCallback(() => store.endFlip(), [store]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      if (delta > 60) store.startFlip("prev");
      else if (delta < -60) store.startFlip("next");
      touchStartX.current = null;
    },
    [store]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") store.startFlip("prev");
      else if (e.key === "ArrowRight") store.startFlip("next");
    },
    [store]
  );

  const handleGoTo = useCallback(
    (spreadIdx: number) => store.goTo(spreadIdx),
    [store]
  );

  const activePageIds = useMemo(() => {
    const ids = new Set<string>();
    if (displaySpread?.leftPage) ids.add(displaySpread.leftPage.id);
    if (displaySpread?.rightPage) ids.add(displaySpread.rightPage.id);
    return ids;
  }, [displaySpread]);

  const thumbnailData = useMemo(() => {
    return pages.map((page, idx) => ({
      id: page.id,
      src: page.imageUrl,
      spreadIdx: idx === 0 ? 0 : Math.ceil(idx / 2),
    }));
  }, [pages]);

  const preloadUrls = useMemo(() => {
    const urls: string[] = [];
    if (nextSpreadData?.leftPage) urls.push(nextSpreadData.leftPage.imageUrl);
    if (nextSpreadData?.rightPage) urls.push(nextSpreadData.rightPage.imageUrl);
    if (prevSpreadData?.leftPage) urls.push(prevSpreadData.leftPage.imageUrl);
    if (prevSpreadData?.rightPage) urls.push(prevSpreadData.rightPage.imageUrl);
    return urls;
  }, [nextSpreadData, prevSpreadData]);

  const flipData = useMemo(() => {
    if (!state.isFlipping || !state.flipDirection) return null;

    if (state.flipDirection === "next") {
      const frontPage =
        currentSpreadData?.rightPage || currentSpreadData?.leftPage;
      const backPage = targetSpreadData?.leftPage || targetSpreadData?.rightPage;
      if (!frontPage) return null;
      return {
        direction: "next" as const,
        frontSrc: frontPage.imageUrl,
        backSrc: backPage?.imageUrl || null,
      };
    }

    const frontPage =
      currentSpreadData?.leftPage || currentSpreadData?.rightPage;
    const backPage = targetSpreadData?.rightPage || targetSpreadData?.leftPage;
    if (!frontPage) return null;
    return {
      direction: "prev" as const,
      frontSrc: frontPage.imageUrl,
      backSrc: backPage?.imageUrl || null,
    };
  }, [state.isFlipping, state.flipDirection, currentSpreadData, targetSpreadData]);

  if (pages.length === 0 || !displaySpread) return null;

  return (
    <div
      className="flex flex-col bg-muted/20 rounded-xl border overflow-hidden shadow-xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="sr-only">
        {preloadUrls.map((url) => (
          <PreloadImage key={url} src={url} />
        ))}
      </div>

      <div className="relative flex items-center justify-center p-4 md:p-6 lg:p-8 min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        <div
          className={cn(
            "relative w-full",
            displaySpread.isSingle ? "max-w-[450px]" : "max-w-[900px]"
          )}
          style={{ perspective: "2000px" }}
        >
          <div
            className="relative w-full bg-white dark:bg-zinc-900 rounded-sm overflow-hidden"
            style={{
              aspectRatio: displaySpread.isSingle ? "3/4" : "2/1.4",
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)",
              transformStyle: "preserve-3d",
            }}
          >
            <SpreadView spread={displaySpread} />

            {flipData && (
              <FlipPage
                direction={flipData.direction}
                frontSrc={flipData.frontSrc}
                backSrc={flipData.backSrc}
                onAnimationEnd={handleFlipEnd}
              />
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={!canPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-white/95 dark:bg-zinc-800/95 disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!canNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-white/95 dark:bg-zinc-800/95 disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/75 text-white text-sm font-medium rounded-full backdrop-blur-sm">
          {(state.isFlipping ? state.targetSpread : state.currentSpread) + 1} /{" "}
          {spreads.length}
        </div>
      </div>

      <div className="flex justify-center gap-2 p-4 bg-muted/30 border-t overflow-x-auto scrollbar-thin">
        {thumbnailData.map((thumb) => (
          <Thumbnail
            key={thumb.id}
            src={thumb.src}
            isActive={activePageIds.has(thumb.id)}
            onClick={() => handleGoTo(thumb.spreadIdx)}
          />
        ))}
      </div>
    </div>
  );
}

export const CatalogViewer = memo(CatalogViewerComponent);
CatalogViewer.displayName = "CatalogViewer";
