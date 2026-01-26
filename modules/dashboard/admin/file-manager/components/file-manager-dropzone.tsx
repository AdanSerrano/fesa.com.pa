"use client";

import { memo, useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneLabels {
  title: string;
  subtitle: string;
  dragActive: string;
}

interface FileManagerDropzoneProps {
  labels: DropzoneLabels;
  isActive: boolean;
  isUploading: boolean;
  onDrop: (files: File[]) => void;
  onDragStateChange: (active: boolean) => void;
}

const FileManagerDropzoneComponent = ({
  labels,
  isActive,
  isUploading,
  onDrop,
  onDragStateChange,
}: FileManagerDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        onDragStateChange(true);
      }
    },
    [onDragStateChange]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        onDragStateChange(false);
      }
    },
    [onDragStateChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      onDragStateChange(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onDrop(files);
      }
    },
    [onDrop, onDragStateChange]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onDrop(files);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onDrop]
  );

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl transition-all duration-200",
        "flex flex-col items-center justify-center p-8 cursor-pointer",
        "hover:border-primary/50 hover:bg-primary/5",
        isActive && "border-primary bg-primary/10 scale-[1.02]",
        isUploading && "pointer-events-none opacity-50"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div
        className={cn(
          "p-4 rounded-full mb-4 transition-colors",
          isActive ? "bg-primary/20" : "bg-muted"
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>

      <p className="text-base font-medium text-center">
        {isActive ? labels.dragActive : labels.title}
      </p>
      <p className="text-sm text-muted-foreground text-center mt-1">
        {labels.subtitle}
      </p>
    </div>
  );
};

export const FileManagerDropzone = memo(FileManagerDropzoneComponent);
FileManagerDropzone.displayName = "FileManagerDropzone";
