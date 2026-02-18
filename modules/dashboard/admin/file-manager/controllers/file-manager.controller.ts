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
    } catch {
      return { error: "Error al listar archivos" };
    }
  }

  public async deleteObject(key: string): Promise<ActionResult> {
    try {
      await this.service.deleteObject(key);
      return { success: "Archivo eliminado correctamente" };
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      return { error: "Error al obtener URL de subida" };
    }
  }

  public async renameObject(
    oldKey: string,
    newName: string
  ): Promise<ActionResult<{ newKey: string }>> {
    try {
      const result = await this.service.renameObject(oldKey, newName);

      if (!result.success) {
        return { error: "Error al renombrar archivo" };
      }

      return { success: "Archivo renombrado correctamente", data: { newKey: result.newKey! } };
    } catch {
      return { error: "Error al renombrar archivo" };
    }
  }

  public async renameFolder(
    oldPrefix: string,
    newName: string
  ): Promise<ActionResult<{ newPrefix: string }>> {
    try {
      const result = await this.service.renameFolder(oldPrefix, newName);

      if (!result.success) {
        return { error: "Error al renombrar carpeta" };
      }

      return { success: "Carpeta renombrada correctamente", data: { newPrefix: result.newPrefix! } };
    } catch {
      return { error: "Error al renombrar carpeta" };
    }
  }
}
