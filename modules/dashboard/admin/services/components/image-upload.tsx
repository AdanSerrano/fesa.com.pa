"use client";

import { memo, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  pendingFile: File | null;
  onChange: (url: string) => void;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  labels?: {
    upload?: string;
    change?: string;
    remove?: string;
    dragDrop?: string;
  };
}

const DEFAULT_LABELS = {
  upload: "Subir imagen",
  change: "Cambiar imagen",
  remove: "Eliminar",
  dragDrop: "Arrastra una imagen o haz clic para seleccionar",
};

export const ImageUpload = memo(function ImageUpload({
  value,
  pendingFile,
  onChange,
  onFileSelect,
  disabled,
  label,
  className,
  labels: customLabels,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);

  const previewUrl = useMemo(() => {
    if (pendingFile) {
      return URL.createObjectURL(pendingFile);
    }
    return value;
  }, [pendingFile, value]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFileSelect]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
    onChange("");
  }, [onChange, onFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [disabled, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const hasImage = !!previewUrl;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {hasImage ? (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized={!!pendingFile}
            />
            {pendingFile && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Pendiente
              </div>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              {labels.change}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-2" />
              {labels.remove}
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
            "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {labels.dragDrop}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            {labels.upload}
          </Button>
        </div>
      )}
    </div>
  );
});
