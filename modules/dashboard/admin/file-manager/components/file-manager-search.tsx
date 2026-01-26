"use client";

import { memo, useCallback, useRef, useDeferredValue, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileManagerSearchProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const FileManagerSearchComponent = ({
  value,
  placeholder,
  onChange,
}: FileManagerSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onChange("");
      }
    },
    [onChange]
  );

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        className={cn(
          "pl-9 pr-9 h-9 bg-muted/50 border-transparent",
          "focus:bg-background focus:border-input",
          "transition-colors"
        )}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export const FileManagerSearch = memo(FileManagerSearchComponent);
FileManagerSearch.displayName = "FileManagerSearch";
