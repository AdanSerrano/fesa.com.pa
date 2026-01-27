"use client";

import { memo, useCallback, useRef, useMemo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Move,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FormImageCropFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  maxFileSize?: number;
  accept?: string;
  outputFormat?: "jpeg" | "png" | "webp";
  outputQuality?: number;
  cropShape?: "rect" | "round";
  labels?: {
    upload?: string;
    change?: string;
    remove?: string;
    crop?: string;
    cancel?: string;
    apply?: string;
    zoom?: string;
    rotate?: string;
  };
}

interface ImageState {
  src: string;
  zoom: number;
  rotation: number;
  position: { x: number; y: number };
}

const DEFAULT_LABELS = {
  upload: "Upload Image",
  change: "Change",
  remove: "Remove",
  crop: "Crop Image",
  cancel: "Cancel",
  apply: "Apply",
  zoom: "Zoom",
  rotate: "Rotate",
};

const CropDialog = memo(function CropDialog({
  open,
  imageState,
  aspectRatio,
  cropShape,
  labels,
  onZoomChange,
  onRotate,
  onPositionChange,
  onApply,
  onCancel,
}: {
  open: boolean;
  imageState: ImageState | null;
  aspectRatio: number;
  cropShape: "rect" | "round";
  labels: typeof DEFAULT_LABELS;
  onZoomChange: (zoom: number) => void;
  onRotate: () => void;
  onPositionChange: (x: number, y: number) => void;
  onApply: () => void;
  onCancel: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !imageState) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      startPos.current = { x: e.clientX, y: e.clientY };
      onPositionChange(imageState.position.x + dx, imageState.position.y + dy);
    },
    [imageState, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (!imageState) return null;

  const cropAreaStyle = useMemo(() => {
    const size = 250;
    const width = aspectRatio >= 1 ? size : size * aspectRatio;
    const height = aspectRatio >= 1 ? size / aspectRatio : size;
    return { width, height };
  }, [aspectRatio]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{labels.crop}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative h-[300px] bg-black/90 rounded-lg overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${imageState.position.x}px, ${imageState.position.y}px) scale(${imageState.zoom}) rotate(${imageState.rotation}deg)`,
              }}
            >
              <img
                src={imageState.src}
                alt="Crop preview"
                className="max-w-none"
                draggable={false}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={cn(
                  "border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]",
                  cropShape === "round" && "rounded-full"
                )}
                style={cropAreaStyle}
              />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Move className="h-3 w-3" />
              Drag to reposition
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[imageState.zoom]}
                onValueChange={([v]) => onZoomChange(v)}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRotate}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                {labels.rotate} 90°
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            {labels.cancel}
          </Button>
          <Button type="button" onClick={onApply}>
            <Check className="h-4 w-4 mr-2" />
            {labels.apply}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

function FormImageCropFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  required,
  aspectRatio = 1,
  maxFileSize = 5 * 1024 * 1024,
  accept = "image/*",
  outputFormat = "jpeg",
  outputQuality = 0.9,
  cropShape = "rect",
  labels: customLabels,
}: FormImageCropFieldProps<TFieldValues, TName>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageStateRef = useRef<ImageState | null>(null);
  const dialogOpenRef = useRef(false);

  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...customLabels }),
    [customLabels]
  );

  const processImage = useCallback(
    async (imageState: ImageState): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = 500;
          const width = aspectRatio >= 1 ? size : size * aspectRatio;
          const height = aspectRatio >= 1 ? size / aspectRatio : size;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(imageState.src);
            return;
          }

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate((imageState.rotation * Math.PI) / 180);
          ctx.scale(imageState.zoom, imageState.zoom);
          ctx.translate(imageState.position.x / imageState.zoom, imageState.position.y / imageState.zoom);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();

          resolve(canvas.toDataURL(`image/${outputFormat}`, outputQuality));
        };
        img.src = imageState.src;
      });
    },
    [aspectRatio, outputFormat, outputQuality]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;

          if (file.size > maxFileSize) {
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            const src = event.target?.result as string;
            imageStateRef.current = {
              src,
              zoom: 1,
              rotation: 0,
              position: { x: 0, y: 0 },
            };
            dialogOpenRef.current = true;
            field.onChange(src);
          };
          reader.readAsDataURL(file);
        };

        const handleApply = async () => {
          if (!imageStateRef.current) return;
          const result = await processImage(imageStateRef.current);
          field.onChange(result);
          dialogOpenRef.current = false;
        };

        const handleCancel = () => {
          dialogOpenRef.current = false;
          imageStateRef.current = null;
        };

        const handleRemove = () => {
          field.onChange("");
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-3">
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  onChange={handleFileSelect}
                  disabled={disabled}
                  className="hidden"
                />
                {field.value ? (
                  <div className="relative inline-block">
                    <div
                      className={cn(
                        "overflow-hidden border-2 border-dashed border-muted-foreground/25",
                        cropShape === "round" ? "rounded-full" : "rounded-lg"
                      )}
                      style={{
                        width: aspectRatio >= 1 ? 150 : 150 * aspectRatio,
                        height: aspectRatio >= 1 ? 150 / aspectRatio : 150,
                      }}
                    >
                      <img
                        src={field.value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemove}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                    className={cn(
                      "h-auto flex-col gap-2 p-6",
                      fieldState.error && "border-destructive"
                    )}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span>{labels.upload}</span>
                  </Button>
                )}
                {field.value && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={disabled}
                  >
                    {labels.change}
                  </Button>
                )}
                <CropDialog
                  open={dialogOpenRef.current}
                  imageState={imageStateRef.current}
                  aspectRatio={aspectRatio}
                  cropShape={cropShape}
                  labels={labels}
                  onZoomChange={(zoom) => {
                    if (imageStateRef.current) {
                      imageStateRef.current.zoom = zoom;
                    }
                  }}
                  onRotate={() => {
                    if (imageStateRef.current) {
                      imageStateRef.current.rotation = (imageStateRef.current.rotation + 90) % 360;
                    }
                  }}
                  onPositionChange={(x, y) => {
                    if (imageStateRef.current) {
                      imageStateRef.current.position = { x, y };
                    }
                  }}
                  onApply={handleApply}
                  onCancel={handleCancel}
                />
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormImageCropField = memo(
  FormImageCropFieldComponent
) as typeof FormImageCropFieldComponent;
