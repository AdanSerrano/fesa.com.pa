export interface R2Object {
  key: string;
  name: string;
  size: number;
  lastModified: Date;
  isFolder: boolean;
  publicUrl?: string;
  mimeType?: string;
}

export interface R2Folder {
  name: string;
  prefix: string;
}

export interface R2ListResult {
  objects: R2Object[];
  folders: R2Folder[];
  currentPath: string;
  hasMore: boolean;
  continuationToken?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export type ViewMode = "grid" | "list";
export type SortField = "name" | "size" | "lastModified";
export type SortOrder = "asc" | "desc";
export type FileTypeFilter = "all" | "images" | "documents" | "videos" | "audio" | "archives";
export type GridSize = "small" | "medium" | "large";

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export interface FileManagerLabels {
  title: string;
  emptyFolder: string;
  emptyFolderDescription: string;
  name: string;
  size: string;
  lastModified: string;
  actions: string;
  download: string;
  delete: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  rootFolder: string;
  back: string;
  refresh: string;
  createFolder: string;
  uploadFile: string;
  folderNamePlaceholder: string;
  creating: string;
  uploading: string;
  deleting: string;
}

export const FILE_TYPE_EXTENSIONS: Record<FileTypeFilter, string[]> = {
  all: [],
  images: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"],
  documents: ["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "csv", "ppt", "pptx"],
  videos: ["mp4", "webm", "mov", "avi", "mkv", "wmv", "flv"],
  audio: ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"],
  archives: ["zip", "rar", "7z", "tar", "gz", "bz2"],
};

export const getFileType = (fileName: string): FileTypeFilter => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
    if (type !== "all" && extensions.includes(extension)) {
      return type as FileTypeFilter;
    }
  }

  return "all";
};

export const isImageFile = (fileName: string): boolean => {
  return getFileType(fileName) === "images";
};
