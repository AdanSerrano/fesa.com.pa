"use client";

import { memo, useCallback, useRef, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface RenameDialogLabels {
  title: string;
  placeholder: string;
  cancel: string;
  rename: string;
  renaming: string;
}

interface FileManagerRenameDialogProps {
  labels: RenameDialogLabels;
  isOpen: boolean;
  currentName: string;
  isFolder: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
}

const FileManagerRenameDialogComponent = ({
  labels,
  isOpen,
  currentName,
  isFolder,
  onClose,
  onRename,
}: FileManagerRenameDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const getNameWithoutExtension = useCallback((name: string) => {
    if (isFolder) return name;
    const lastDot = name.lastIndexOf(".");
    return lastDot > 0 ? name.substring(0, lastDot) : name;
  }, [isFolder]);

  const getExtension = useCallback((name: string) => {
    if (isFolder) return "";
    const lastDot = name.lastIndexOf(".");
    return lastDot > 0 ? name.substring(lastDot) : "";
  }, [isFolder]);

  const handleRename = useCallback(() => {
    const newName = inputRef.current?.value?.trim();
    if (!newName) return;

    const extension = getExtension(currentName);
    const finalName = isFolder ? newName : `${newName}${extension}`;

    startTransition(async () => {
      await onRename(finalName);
      onClose();
    });
  }, [currentName, isFolder, getExtension, onRename, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isPending) {
        handleRename();
      }
    },
    [handleRename, isPending]
  );

  const defaultValue = getNameWithoutExtension(currentName);
  const extension = getExtension(currentName);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            defaultValue={defaultValue}
            placeholder={labels.placeholder}
            disabled={isPending}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          {extension && (
            <span className="text-sm text-muted-foreground shrink-0">
              {extension}
            </span>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              {labels.cancel}
            </Button>
          </DialogClose>
          <Button onClick={handleRename} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {labels.renaming}
              </>
            ) : (
              labels.rename
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const FileManagerRenameDialog = memo(FileManagerRenameDialogComponent);
FileManagerRenameDialog.displayName = "FileManagerRenameDialog";
