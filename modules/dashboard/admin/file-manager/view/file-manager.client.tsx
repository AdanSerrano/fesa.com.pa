"use client";

import { memo, useMemo, useCallback, useTransition, useReducer, useDeferredValue, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { HardDrive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileManagerBreadcrumb } from "../components/file-manager-breadcrumb";
import { FileManagerToolbar } from "../components/file-manager-toolbar";
import { FileManagerTable } from "../components/file-manager-table";
import { FileManagerGrid } from "../components/file-manager-grid";
import { FileManagerViewToggle } from "../components/file-manager-view-toggle";
import { FileManagerSearch } from "../components/file-manager-search";
import { FileManagerFilters } from "../components/file-manager-filters";
import { FileManagerDropzone } from "../components/file-manager-dropzone";
import { FileManagerUploadProgress } from "../components/file-manager-upload-progress";
import { FileManagerSelectionBar } from "../components/file-manager-selection-bar";
import { FileManagerRenameDialog } from "../components/file-manager-rename-dialog";
import { FileManagerDetailsPanel } from "../components/file-manager-details-panel";
import { FileManagerGallery } from "../components/file-manager-gallery";
import {
  deleteR2ObjectAction,
  deleteR2FolderAction,
  createR2FolderAction,
  getR2UploadUrlAction,
} from "../actions/file-manager.actions";
import type {
  R2ListResult,
  R2Object,
  R2Folder,
  ViewMode,
  SortConfig,
  FileTypeFilter,
  GridSize,
  UploadProgress,
} from "../types/file-manager.types";
import { FILE_TYPE_EXTENSIONS, isImageFile } from "../types/file-manager.types";

interface FileManagerClientProps {
  initialData: R2ListResult;
  initialPath: string;
}

type DeleteType = "file" | "folder" | "bulk" | null;

interface RenameTarget {
  type: "file" | "folder";
  item: R2Object | R2Folder;
}

interface ClientState {
  deleteKey: string | null;
  deleteType: DeleteType;
  viewMode: ViewMode;
  searchQuery: string;
  sortConfig: SortConfig;
  fileTypeFilter: FileTypeFilter;
  gridSize: GridSize;
  selectedFiles: Set<string>;
  isDragActive: boolean;
  uploads: UploadProgress[];
  renameTarget: RenameTarget | null;
  detailsFile: R2Object | null;
  galleryIndex: number;
  isGalleryOpen: boolean;
}

type ClientAction =
  | { type: "SET_DELETE"; payload: { key: string | null; deleteType: DeleteType } }
  | { type: "SET_VIEW_MODE"; payload: ViewMode }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SORT_CONFIG"; payload: SortConfig }
  | { type: "SET_FILE_TYPE_FILTER"; payload: FileTypeFilter }
  | { type: "SET_GRID_SIZE"; payload: GridSize }
  | { type: "TOGGLE_FILE_SELECTION"; payload: { key: string; selected: boolean } }
  | { type: "SELECT_ALL_FILES"; payload: string[] }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_DRAG_ACTIVE"; payload: boolean }
  | { type: "ADD_UPLOAD"; payload: UploadProgress }
  | { type: "UPDATE_UPLOAD"; payload: { id: string; updates: Partial<UploadProgress> } }
  | { type: "REMOVE_UPLOAD"; payload: string }
  | { type: "SET_RENAME_TARGET"; payload: RenameTarget | null }
  | { type: "SET_DETAILS_FILE"; payload: R2Object | null }
  | { type: "OPEN_GALLERY"; payload: number }
  | { type: "CLOSE_GALLERY" }
  | { type: "SET_GALLERY_INDEX"; payload: number };

function clientReducer(state: ClientState, action: ClientAction): ClientState {
  switch (action.type) {
    case "SET_DELETE":
      return { ...state, deleteKey: action.payload.key, deleteType: action.payload.deleteType };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SORT_CONFIG":
      return { ...state, sortConfig: action.payload };
    case "SET_FILE_TYPE_FILTER":
      return { ...state, fileTypeFilter: action.payload };
    case "SET_GRID_SIZE":
      return { ...state, gridSize: action.payload };
    case "TOGGLE_FILE_SELECTION": {
      const newSelection = new Set(state.selectedFiles);
      if (action.payload.selected) {
        newSelection.add(action.payload.key);
      } else {
        newSelection.delete(action.payload.key);
      }
      return { ...state, selectedFiles: newSelection };
    }
    case "SELECT_ALL_FILES":
      return { ...state, selectedFiles: new Set(action.payload) };
    case "CLEAR_SELECTION":
      return { ...state, selectedFiles: new Set() };
    case "SET_DRAG_ACTIVE":
      return { ...state, isDragActive: action.payload };
    case "ADD_UPLOAD":
      return { ...state, uploads: [...state.uploads, action.payload] };
    case "UPDATE_UPLOAD":
      return {
        ...state,
        uploads: state.uploads.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.updates } : u
        ),
      };
    case "REMOVE_UPLOAD":
      return { ...state, uploads: state.uploads.filter((u) => u.id !== action.payload) };
    case "SET_RENAME_TARGET":
      return { ...state, renameTarget: action.payload };
    case "SET_DETAILS_FILE":
      return { ...state, detailsFile: action.payload };
    case "OPEN_GALLERY":
      return { ...state, isGalleryOpen: true, galleryIndex: action.payload };
    case "CLOSE_GALLERY":
      return { ...state, isGalleryOpen: false };
    case "SET_GALLERY_INDEX":
      return { ...state, galleryIndex: action.payload };
    default:
      return state;
  }
}

const FileManagerClientComponent = ({
  initialData,
  initialPath,
}: FileManagerClientProps) => {
  const t = useTranslations("FileManager");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const uploadIdCounter = useRef(0);

  const [state, dispatch] = useReducer(clientReducer, {
    deleteKey: null,
    deleteType: null,
    viewMode: "grid" as ViewMode,
    searchQuery: "",
    sortConfig: { field: "name", order: "asc" } as SortConfig,
    fileTypeFilter: "all" as FileTypeFilter,
    gridSize: "medium" as GridSize,
    selectedFiles: new Set<string>(),
    isDragActive: false,
    uploads: [],
    renameTarget: null,
    detailsFile: null,
    galleryIndex: 0,
    isGalleryOpen: false,
  });

  const deferredSearchQuery = useDeferredValue(state.searchQuery);

  const filteredAndSortedData = useMemo(() => {
    let folders = [...initialData.folders];
    let files = [...initialData.objects];

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase();
      folders = folders.filter((f) => f.name.toLowerCase().includes(query));
      files = files.filter((f) => f.name.toLowerCase().includes(query));
    }

    if (state.fileTypeFilter !== "all") {
      const extensions = FILE_TYPE_EXTENSIONS[state.fileTypeFilter];
      files = files.filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        return extensions.includes(ext);
      });
    }

    folders.sort((a, b) => {
      const modifier = state.sortConfig.order === "asc" ? 1 : -1;
      return a.name.localeCompare(b.name) * modifier;
    });

    files.sort((a, b) => {
      const modifier = state.sortConfig.order === "asc" ? 1 : -1;
      switch (state.sortConfig.field) {
        case "size":
          return (a.size - b.size) * modifier;
        case "lastModified":
          return (new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()) * modifier;
        default:
          return a.name.localeCompare(b.name) * modifier;
      }
    });

    return { ...initialData, folders, objects: files };
  }, [initialData, deferredSearchQuery, state.fileTypeFilter, state.sortConfig]);

  const imageFiles = useMemo(
    () => filteredAndSortedData.objects.filter((f) => isImageFile(f.name)),
    [filteredAndSortedData.objects]
  );

  const toolbarLabels = useMemo(() => ({
    refresh: t("refresh"),
    createFolder: t("createFolder"),
    uploadFile: t("uploadFile"),
    folderNamePlaceholder: t("folderNamePlaceholder"),
    creating: t("creating"),
    uploading: t("uploading"),
    cancel: tCommon("cancel"),
    create: tCommon("create"),
    newItem: t("newItem"),
  }), [t, tCommon]);

  const tableLabels = useMemo(() => ({
    name: t("name"),
    size: t("size"),
    lastModified: t("lastModified"),
    actions: t("actions"),
    emptyFolder: t("emptyFolder"),
    emptyFolderDescription: t("emptyFolderDescription"),
    download: tCommon("save"),
    delete: tCommon("delete"),
  }), [t, tCommon]);

  const gridLabels = useMemo(() => ({
    download: tCommon("save"),
    delete: tCommon("delete"),
    deleteFolder: t("deleteFolder"),
    preview: t("preview"),
    open: t("open"),
    rename: t("rename"),
    details: t("details"),
    emptyFolder: t("emptyFolder"),
    emptyFolderDescription: t("emptyFolderDescription"),
    noResults: t("noResults"),
    noResultsDescription: t("noResultsDescription"),
  }), [t, tCommon]);

  const filterLabels = useMemo(() => ({
    all: t("filterAll"),
    images: t("filterImages"),
    documents: t("filterDocuments"),
    videos: t("filterVideos"),
    audio: t("filterAudio"),
    archives: t("filterArchives"),
    sortBy: t("sortBy"),
    sortName: t("sortName"),
    sortSize: t("sortSize"),
    sortDate: t("sortDate"),
    ascending: t("ascending"),
    descending: t("descending"),
    gridSize: t("gridSize"),
    gridSmall: t("gridSmall"),
    gridMedium: t("gridMedium"),
    gridLarge: t("gridLarge"),
  }), [t]);

  const dropzoneLabels = useMemo(() => ({
    title: t("dropzoneTitle"),
    subtitle: t("dropzoneSubtitle"),
    dragActive: t("dropzoneDragActive"),
  }), [t]);

  const uploadLabels = useMemo(() => ({
    uploading: t("uploading"),
    completed: t("uploadCompleted"),
    error: t("uploadError"),
    cancel: tCommon("cancel"),
  }), [t, tCommon]);

  const selectionLabels = useMemo(() => ({
    selected: t.raw("selectedCount"),
    selectAll: t("selectAll"),
    clearSelection: t("clearSelection"),
    deleteSelected: t("deleteSelected"),
    downloadSelected: t("downloadSelected"),
  }), [t]);

  const renameLabels = useMemo(() => ({
    title: t("renameTitle"),
    placeholder: t("renamePlaceholder"),
    cancel: tCommon("cancel"),
    rename: t("rename"),
    renaming: t("renaming"),
  }), [t, tCommon]);

  const detailsLabels = useMemo(() => ({
    title: t("detailsTitle"),
    name: t("name"),
    size: t("size"),
    type: t("type"),
    lastModified: t("lastModified"),
    path: t("path"),
    download: tCommon("save"),
    delete: tCommon("delete"),
    openInNewTab: t("openInNewTab"),
    rename: t("rename"),
    copyLink: t("copyLink"),
    linkCopied: t("linkCopied"),
  }), [t, tCommon]);

  const galleryLabels = useMemo(() => ({
    download: tCommon("save"),
    delete: tCommon("delete"),
    openInNewTab: t("openInNewTab"),
    close: tCommon("close"),
    previous: t("previous"),
    next: t("next"),
    imageCount: t.raw("imageCount"),
  }), [t, tCommon]);

  const viewToggleLabels = useMemo(() => ({
    gridView: t("gridView"),
    listView: t("listView"),
  }), [t]);

  const handleNavigate = useCallback((path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (path) {
      params.set("path", path);
    } else {
      params.delete("path");
    }
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleRefresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleCreateFolder = useCallback(async (name: string) => {
    const result = await createR2FolderAction(initialPath, name);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(result.success);
    router.refresh();
  }, [initialPath, router]);

  const handleUploadFiles = useCallback(async (files: File[]) => {
    for (const file of files) {
      const id = `upload-${++uploadIdCounter.current}`;
      dispatch({ type: "ADD_UPLOAD", payload: { id, fileName: file.name, progress: 0, status: "pending" } });

      try {
        const urlResult = await getR2UploadUrlAction(initialPath, file.name, file.type);
        if (urlResult.error || !urlResult.data) {
          dispatch({ type: "UPDATE_UPLOAD", payload: { id, updates: { status: "error", error: urlResult.error } } });
          continue;
        }

        dispatch({ type: "UPDATE_UPLOAD", payload: { id, updates: { status: "uploading", progress: 10 } } });

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            dispatch({ type: "UPDATE_UPLOAD", payload: { id, updates: { progress } } });
          }
        });

        await new Promise<void>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              dispatch({ type: "UPDATE_UPLOAD", payload: { id, updates: { status: "completed", progress: 100 } } });
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          };
          xhr.onerror = () => reject(new Error("Upload failed"));
          xhr.open("PUT", urlResult.data!.url);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        dispatch({ type: "UPDATE_UPLOAD", payload: { id, updates: { status: "error", error: t("uploadError") } } });
      }
    }
    router.refresh();
  }, [initialPath, router, t]);

  const handleDrop = useCallback((files: File[]) => {
    handleUploadFiles(files);
  }, [handleUploadFiles]);

  const handleDownload = useCallback((url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handlePreview = useCallback((file: R2Object) => {
    const index = imageFiles.findIndex((f) => f.key === file.key);
    if (index >= 0) {
      dispatch({ type: "OPEN_GALLERY", payload: index });
    }
  }, [imageFiles]);

  const handleDeleteRequest = useCallback((key: string) => {
    dispatch({ type: "SET_DELETE", payload: { key, deleteType: "file" } });
  }, []);

  const handleDeleteFolderRequest = useCallback((prefix: string) => {
    dispatch({ type: "SET_DELETE", payload: { key: prefix, deleteType: "folder" } });
  }, []);

  const handleDeleteSelectedRequest = useCallback(() => {
    if (state.selectedFiles.size > 0) {
      dispatch({ type: "SET_DELETE", payload: { key: "bulk", deleteType: "bulk" } });
    }
  }, [state.selectedFiles.size]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!state.deleteKey || !state.deleteType) return;

    startTransition(async () => {
      if (state.deleteType === "bulk") {
        const keys = Array.from(state.selectedFiles);
        let successCount = 0;
        for (const key of keys) {
          const result = await deleteR2ObjectAction(key);
          if (!result.error) successCount++;
        }
        toast.success(t("bulkDeleteSuccess", { count: successCount }));
        dispatch({ type: "CLEAR_SELECTION" });
      } else if (state.deleteType === "folder") {
        const result = await deleteR2FolderAction(state.deleteKey!);
        if (result.error) {
          if (result.error === "FOLDER_NOT_EMPTY") {
            toast.error(t("folderNotEmptyError"));
          } else {
            toast.error(result.error);
          }
        } else {
          toast.success(result.success);
        }
      } else {
        const result = await deleteR2ObjectAction(state.deleteKey!);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
        }
      }
      router.refresh();
      dispatch({ type: "SET_DELETE", payload: { key: null, deleteType: null } });
      dispatch({ type: "SET_DETAILS_FILE", payload: null });
    });
  }, [state.deleteKey, state.deleteType, state.selectedFiles, router, t]);

  const handleDeleteCancel = useCallback(() => {
    dispatch({ type: "SET_DELETE", payload: { key: null, deleteType: null } });
  }, []);

  const handleRename = useCallback((file: R2Object) => {
    dispatch({ type: "SET_RENAME_TARGET", payload: { type: "file", item: file } });
  }, []);

  const handleRenameFolder = useCallback((folder: R2Folder) => {
    dispatch({ type: "SET_RENAME_TARGET", payload: { type: "folder", item: folder } });
  }, []);

  const handleRenameConfirm = useCallback(async (newName: string) => {
    toast.info(t("renameNotImplemented"));
    dispatch({ type: "SET_RENAME_TARGET", payload: null });
  }, [t]);

  const handleRenameCancel = useCallback(() => {
    dispatch({ type: "SET_RENAME_TARGET", payload: null });
  }, []);

  const handleShowDetails = useCallback((file: R2Object) => {
    dispatch({ type: "SET_DETAILS_FILE", payload: file });
  }, []);

  const handleCloseDetails = useCallback(() => {
    dispatch({ type: "SET_DETAILS_FILE", payload: null });
  }, []);

  const handleSelectFile = useCallback((file: R2Object, selected: boolean) => {
    dispatch({ type: "TOGGLE_FILE_SELECTION", payload: { key: file.key, selected } });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allKeys = filteredAndSortedData.objects.map((f) => f.key);
    dispatch({ type: "SELECT_ALL_FILES", payload: allKeys });
  }, [filteredAndSortedData.objects]);

  const handleClearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const handleDownloadSelected = useCallback(() => {
    const files = filteredAndSortedData.objects.filter((f) => state.selectedFiles.has(f.key));
    files.forEach((f) => {
      if (f.publicUrl) handleDownload(f.publicUrl, f.name);
    });
  }, [filteredAndSortedData.objects, state.selectedFiles, handleDownload]);

  const handleUploadCancel = useCallback((id: string) => {
    dispatch({ type: "REMOVE_UPLOAD", payload: id });
  }, []);

  const handleUploadDismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE_UPLOAD", payload: id });
  }, []);

  const totalItems = filteredAndSortedData.folders.length + filteredAndSortedData.objects.length;
  const isFiltered = deferredSearchQuery.trim().length > 0 || state.fileTypeFilter !== "all";
  const isSelectionMode = state.selectedFiles.size > 0;
  const hasActiveUploads = state.uploads.some((u) => u.status === "uploading" || u.status === "pending");

  const deleteDialogTitle = state.deleteType === "folder"
    ? t("deleteFolderConfirmTitle")
    : state.deleteType === "bulk"
    ? t("bulkDeleteConfirmTitle")
    : t("deleteConfirmTitle");

  const deleteDialogMessage = state.deleteType === "folder"
    ? t("deleteFolderConfirmMessage")
    : state.deleteType === "bulk"
    ? t("bulkDeleteConfirmMessage", { count: state.selectedFiles.size })
    : t("deleteConfirmMessage");

  return (
    <>
      <Card className="overflow-hidden">
        <div className="border-b bg-gradient-to-r from-primary/5 via-primary/3 to-transparent ">
          <div className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{t("title")}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("itemCount", { count: totalItems })}
                    </p>
                  </div>
                </div>
                <FileManagerToolbar
                  labels={toolbarLabels}
                  currentPath={initialPath}
                  isPending={isPending}
                  onRefresh={handleRefresh}
                  onCreateFolder={handleCreateFolder}
                  onUploadFile={(file) => handleUploadFiles([file])}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <FileManagerSearch
                    value={state.searchQuery}
                    placeholder={t("searchPlaceholder")}
                    onChange={(v) => dispatch({ type: "SET_SEARCH_QUERY", payload: v })}
                  />
                  <div className="flex items-center gap-2">
                    <FileManagerViewToggle
                      viewMode={state.viewMode}
                      labels={viewToggleLabels}
                      onViewModeChange={(v) => dispatch({ type: "SET_VIEW_MODE", payload: v })}
                    />
                  </div>
                </div>

                <FileManagerFilters
                  labels={filterLabels}
                  currentFilter={state.fileTypeFilter}
                  currentSort={state.sortConfig}
                  currentGridSize={state.gridSize}
                  onFilterChange={(f) => dispatch({ type: "SET_FILE_TYPE_FILTER", payload: f })}
                  onSortChange={(s) => dispatch({ type: "SET_SORT_CONFIG", payload: s })}
                  onGridSizeChange={(s) => dispatch({ type: "SET_GRID_SIZE", payload: s })}
                />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 md:p-6 space-y-4">
          <FileManagerBreadcrumb
            currentPath={initialPath}
            rootLabel={t("rootFolder")}
            onNavigate={handleNavigate}
          />

          <FileManagerDropzone
            labels={dropzoneLabels}
            isActive={state.isDragActive}
            isUploading={hasActiveUploads}
            onDrop={handleDrop}
            onDragStateChange={(v) => dispatch({ type: "SET_DRAG_ACTIVE", payload: v })}
          />

          {state.viewMode === "grid" ? (
            <FileManagerGrid
              folders={filteredAndSortedData.folders}
              files={filteredAndSortedData.objects}
              labels={gridLabels}
              gridSize={state.gridSize}
              isPending={isPending}
              isFiltered={isFiltered}
              selectedFiles={state.selectedFiles}
              isSelectionMode={isSelectionMode}
              onNavigate={handleNavigate}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onDelete={handleDeleteRequest}
              onDeleteFolder={handleDeleteFolderRequest}
              onRename={handleRename}
              onRenameFolder={handleRenameFolder}
              onShowDetails={handleShowDetails}
              onSelectFile={handleSelectFile}
            />
          ) : (
            <FileManagerTable
              folders={filteredAndSortedData.folders}
              files={filteredAndSortedData.objects}
              labels={tableLabels}
              locale={locale}
              isPending={isPending}
              onNavigate={handleNavigate}
              onDownload={handleDownload}
              onDelete={handleDeleteRequest}
            />
          )}
        </CardContent>
      </Card>

      <FileManagerUploadProgress
        uploads={state.uploads}
        labels={uploadLabels}
        onCancel={handleUploadCancel}
        onDismiss={handleUploadDismiss}
      />

      <FileManagerSelectionBar
        labels={selectionLabels}
        selectedCount={state.selectedFiles.size}
        totalCount={filteredAndSortedData.objects.length}
        isPending={isPending}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelectedRequest}
        onDownloadSelected={handleDownloadSelected}
      />

      <FileManagerDetailsPanel
        file={state.detailsFile}
        labels={detailsLabels}
        locale={locale}
        isOpen={state.detailsFile !== null}
        onClose={handleCloseDetails}
        onDownload={handleDownload}
        onDelete={handleDeleteRequest}
        onRename={handleRename}
      />

      <FileManagerGallery
        images={imageFiles}
        currentIndex={state.galleryIndex}
        labels={galleryLabels}
        isOpen={state.isGalleryOpen}
        onClose={() => dispatch({ type: "CLOSE_GALLERY" })}
        onNavigate={(i) => dispatch({ type: "SET_GALLERY_INDEX", payload: i })}
        onDownload={handleDownload}
        onDelete={handleDeleteRequest}
      />

      <FileManagerRenameDialog
        labels={renameLabels}
        isOpen={state.renameTarget !== null}
        currentName={state.renameTarget?.type === "file" ? (state.renameTarget.item as R2Object).name : (state.renameTarget?.item as R2Folder)?.name || ""}
        isFolder={state.renameTarget?.type === "folder"}
        onClose={handleRenameCancel}
        onRename={handleRenameConfirm}
      />

      <AlertDialog open={state.deleteKey !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteDialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>{tCommon("delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const FileManagerClient = memo(FileManagerClientComponent);
FileManagerClient.displayName = "FileManagerClient";
