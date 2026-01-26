"use client";

import { memo, useCallback, useMemo } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  ExternalLink,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { R2Object } from "../types/file-manager.types";
import { isImageFile } from "../types/file-manager.types";

interface GalleryLabels {
  download: string;
  delete: string;
  openInNewTab: string;
  close: string;
  previous: string;
  next: string;
  imageCount: string;
}

interface FileManagerGalleryProps {
  images: R2Object[];
  currentIndex: number;
  labels: GalleryLabels;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onDownload: (url: string, name: string) => void;
  onDelete: (key: string) => void;
}

const FileManagerGalleryComponent = ({
  images,
  currentIndex,
  labels,
  isOpen,
  onClose,
  onNavigate,
  onDownload,
  onDelete,
}: FileManagerGalleryProps) => {
  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [handlePrevious, handleNext, onClose]
  );

  const handleDownload = useCallback(() => {
    if (currentImage?.publicUrl) {
      onDownload(currentImage.publicUrl, currentImage.name);
    }
  }, [currentImage, onDownload]);

  const handleDelete = useCallback(() => {
    if (currentImage) {
      onDelete(currentImage.key);
      if (images.length === 1) {
        onClose();
      } else if (currentIndex === images.length - 1) {
        onNavigate(currentIndex - 1);
      }
    }
  }, [currentImage, currentIndex, images.length, onDelete, onClose, onNavigate]);

  const handleOpenInNewTab = useCallback(() => {
    if (currentImage?.publicUrl) {
      window.open(currentImage.publicUrl, "_blank");
    }
  }, [currentImage]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen || !currentImage) return null;

  const extension = currentImage.name.split(".").pop()?.toUpperCase() || "";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {extension}
          </Badge>
          <span className="text-sm font-medium truncate max-w-[300px]">
            {currentImage.name}
          </span>
          {hasMultiple && (
            <span className="text-sm text-white/60">
              {labels.imageCount
                .replace("{current}", String(currentIndex + 1))
                .replace("{total}", String(images.length))}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleOpenInNewTab}
            title={labels.openInNewTab}
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleDownload}
            title={labels.download}
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-red-500/80"
            onClick={handleDelete}
            title={labels.delete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onClose}
            title={labels.close}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
        {hasMultiple && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/20 h-12 w-12"
            onClick={handlePrevious}
            title={labels.previous}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        <img
          src={currentImage.publicUrl}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain rounded-lg"
        />

        {hasMultiple && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/20 h-12 w-12"
            onClick={handleNext}
            title={labels.next}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-2 p-4">
          {images.map((image, index) => (
            <button
              key={image.key}
              onClick={() => onNavigate(index)}
              className={cn(
                "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <img
                src={image.publicUrl}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FileManagerGallery = memo(FileManagerGalleryComponent);
FileManagerGallery.displayName = "FileManagerGallery";
