"use client";

import { memo, useCallback, useRef, useTransition, useReducer } from "react";
import { RefreshCw, FolderPlus, Upload, Loader2, Plus } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface FileManagerToolbarLabels {
  refresh: string;
  createFolder: string;
  uploadFile: string;
  folderNamePlaceholder: string;
  creating: string;
  uploading: string;
  cancel: string;
  create: string;
  newItem: string;
}

interface FileManagerToolbarProps {
  labels: FileManagerToolbarLabels;
  currentPath: string;
  isPending: boolean;
  onRefresh: () => void;
  onCreateFolder: (name: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
}

type DialogState = { isOpen: boolean };
type DialogAction = { type: "OPEN" } | { type: "CLOSE" };

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN":
      return { isOpen: true };
    case "CLOSE":
      return { isOpen: false };
    default:
      return state;
  }
}

const FileManagerToolbarComponent = ({
  labels,
  isPending,
  onRefresh,
  onCreateFolder,
  onUploadFile,
}: FileManagerToolbarProps) => {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, startCreateTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [dialogState, dispatchDialog] = useReducer(dialogReducer, { isOpen: false });

  const handleOpenDialog = useCallback(() => {
    dispatchDialog({ type: "OPEN" });
  }, []);

  const handleCloseDialog = useCallback(() => {
    dispatchDialog({ type: "CLOSE" });
  }, []);

  const handleCreateFolder = useCallback(() => {
    const name = folderInputRef.current?.value?.trim();
    if (!name) {
      toast.error("Ingresa un nombre para la carpeta");
      return;
    }

    startCreateTransition(async () => {
      await onCreateFolder(name);
      if (folderInputRef.current) {
        folderInputRef.current.value = "";
      }
      dispatchDialog({ type: "CLOSE" });
    });
  }, [onCreateFolder]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      startUploadTransition(async () => {
        await onUploadFile(file);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
    },
    [onUploadFile]
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const isDisabled = isPending || isCreating || isUploading;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={isDisabled}
          onClick={onRefresh}
          className="h-9 w-9"
          title={labels.refresh}
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        </Button>

        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={handleOpenDialog}
            className="h-9"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            {labels.createFolder}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isDisabled}
          />
          <Button
            variant="default"
            size="sm"
            disabled={isDisabled}
            onClick={handleUploadClick}
            className="h-9"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {labels.uploading}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {labels.uploadFile}
              </>
            )}
          </Button>
        </div>

        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" disabled={isDisabled} className="h-9">
                <Plus className="h-4 w-4 mr-2" />
                {labels.newItem}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpenDialog}>
                <FolderPlus className="h-4 w-4 mr-2" />
                {labels.createFolder}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                {labels.uploadFile}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden sm:block"
            onChange={handleFileChange}
            disabled={isDisabled}
          />
        </div>
      </div>

      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{labels.createFolder}</DialogTitle>
          </DialogHeader>
          <Input
            ref={folderInputRef}
            placeholder={labels.folderNamePlaceholder}
            disabled={isCreating}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreating}>
                {labels.cancel}
              </Button>
            </DialogClose>
            <Button onClick={handleCreateFolder} disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {labels.creating}
                </>
              ) : (
                labels.create
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const FileManagerToolbar = memo(FileManagerToolbarComponent);
FileManagerToolbar.displayName = "FileManagerToolbar";
