"use client";

import { memo, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon, GripVertical, Plus } from "lucide-react";

export interface ImageItem {
  id?: string;
  url: string;
  alt?: string | null;
  order: number;
  file?: File;
}

interface MultiImageUploadProps {
  value: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  disabled?: boolean;
  label?: string;
  maxImages?: number;
  className?: string;
  labels?: {
    addImages?: string;
    dragDrop?: string;
    remove?: string;
    maxReached?: string;
  };
}

const DEFAULT_LABELS = {
  addImages: "Agregar imágenes",
  dragDrop: "Arrastra imágenes o haz clic para seleccionar",
  remove: "Eliminar",
  maxReached: "Máximo de imágenes alcanzado",
};

const ImagePreview = memo(function ImagePreview({
  image,
  index,
  onRemove,
  disabled,
  removeLabel,
}: {
  image: ImageItem;
  index: number;
  onRemove: (index: number) => void;
  disabled?: boolean;
  removeLabel: string;
}) {
  const previewUrl = useMemo(() => {
    if (image.file) {
      return URL.createObjectURL(image.file);
    }
    return image.url;
  }, [image.file, image.url]);

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="relative group">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
        <Image
          src={previewUrl}
          alt={image.alt || `Image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
          unoptimized={!!image.file}
        />
        {image.file && (
          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
            Pendiente
          </div>
        )}
        <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
          {index + 1}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4 mr-1" />
          {removeLabel}
        </Button>
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="h-5 w-5 text-white drop-shadow-lg" />
      </div>
    </div>
  );
});

export const MultiImageUpload = memo(function MultiImageUpload({
  value,
  onChange,
  disabled,
  label,
  maxImages = 10,
  className,
  labels: customLabels,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);

  const canAddMore = value.length < maxImages;

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remainingSlots = maxImages - value.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      const newImages: ImageItem[] = filesToAdd
        .filter((file) => file.type.startsWith("image/"))
        .map((file, index) => ({
          url: "",
          order: value.length + index,
          file,
        }));

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [value, maxImages, onChange]
  );

  const handleRemove = useCallback(
    (indexToRemove: number) => {
      const newImages = value
        .filter((_, index) => index !== indexToRemove)
        .map((img, index) => ({ ...img, order: index }));
      onChange(newImages);
    },
    [value, onChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled && canAddMore) {
      inputRef.current?.click();
    }
  }, [disabled, canAddMore]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || !canAddMore) return;

      const files = e.dataTransfer.files;
      const remainingSlots = maxImages - value.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      const newImages: ImageItem[] = filesToAdd
        .filter((file) => file.type.startsWith("image/"))
        .map((file, index) => ({
          url: "",
          order: value.length + index,
          file,
        }));

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
      }
    },
    [disabled, canAddMore, maxImages, value, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <span className="text-xs text-muted-foreground">
            {value.length} / {maxImages}
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={disabled || !canAddMore}
        className="hidden"
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((image, index) => (
            <ImagePreview
              key={image.id || `new-${index}`}
              image={image}
              index={index}
              onRemove={handleRemove}
              disabled={disabled}
              removeLabel={labels.remove}
            />
          ))}
        </div>
      )}

      {canAddMore ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
            "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center mb-3">
            {labels.dragDrop}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            {labels.addImages}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          {labels.maxReached}
        </p>
      )}
    </div>
  );
});
