import { FileManagerService } from "../services/file-manager.service";
import type { R2ListResult } from "../types/file-manager.types";

interface ActionResult<T = unknown> {
  success?: string;
  error?: string;
  data?: T;
}

export class FileManagerController {
  private service: FileManagerService;

  constructor() {
    this.service = new FileManagerService();
  }

  public async listObjects(
    prefix?: string,
    continuationToken?: string
  ): Promise<ActionResult<R2ListResult>> {
    try {
      const result = await this.service.listObjects(prefix, continuationToken);
      return { data: result };
    } catch (error) {
      console.error("Error listing objects:", error);
      return { error: "Error al listar archivos" };
    }
  }

  public async deleteObject(key: string): Promise<ActionResult> {
    try {
      await this.service.deleteObject(key);
      return { success: "Archivo eliminado correctamente" };
    } catch (error) {
      console.error("Error deleting object:", error);
      return { error: "Error al eliminar archivo" };
    }
  }

  public async deleteFolder(prefix: string): Promise<ActionResult> {
    try {
      const result = await this.service.deleteFolder(prefix);

      if (!result.success) {
        if (result.error === "FOLDER_NOT_EMPTY") {
          return { error: "FOLDER_NOT_EMPTY" };
        }
        return { error: "Error al eliminar carpeta" };
      }

      return { success: "Carpeta eliminada correctamente" };
    } catch (error) {
      console.error("Error deleting folder:", error);
      return { error: "Error al eliminar carpeta" };
    }
  }

  public async createFolder(
    path: string,
    folderName: string
  ): Promise<ActionResult> {
    try {
      await this.service.createFolder(path, folderName);
      return { success: "Carpeta creada correctamente" };
    } catch (error) {
      console.error("Error creating folder:", error);
      return { error: "Error al crear carpeta" };
    }
  }

  public async getUploadUrl(
    path: string,
    fileName: string,
    contentType: string
  ): Promise<ActionResult<{ url: string; key: string }>> {
    try {
      const result = await this.service.getUploadUrl(path, fileName, contentType);
      return { data: result };
    } catch (error) {
      console.error("Error getting upload URL:", error);
      return { error: "Error al obtener URL de subida" };
    }
  }
}
