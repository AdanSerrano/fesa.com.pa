import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  _Object,
  CommonPrefix,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, R2_CONFIG } from "@/lib/aws/s3-client";
import type { R2Object, R2Folder, R2ListResult } from "../types/file-manager.types";

export class FileManagerService {
  private bucket = R2_CONFIG.bucket;
  private publicUrl = R2_CONFIG.publicUrl;

  public async listObjects(
    prefix: string = "",
    continuationToken?: string
  ): Promise<R2ListResult> {
    const normalizedPrefix = prefix ? (prefix.endsWith("/") ? prefix : `${prefix}/`) : "";

    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: normalizedPrefix,
      Delimiter: "/",
      MaxKeys: 100,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    const objects: R2Object[] = (response.Contents || [])
      .filter((obj: _Object) => obj.Key !== normalizedPrefix)
      .map((obj: _Object) => ({
        key: obj.Key || "",
        name: this.getFileName(obj.Key || "", normalizedPrefix),
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
        isFolder: false,
        publicUrl: this.getPublicUrl(obj.Key || ""),
      }));

    const folders: R2Folder[] = (response.CommonPrefixes || []).map(
      (prefix: CommonPrefix) => ({
        name: this.getFolderName(prefix.Prefix || ""),
        prefix: prefix.Prefix || "",
      })
    );

    return {
      objects,
      folders,
      currentPath: normalizedPrefix,
      hasMore: response.IsTruncated || false,
      continuationToken: response.NextContinuationToken,
    };
  }

  public async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }

  public async isFolderEmpty(prefix: string): Promise<boolean> {
    const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: normalizedPrefix,
      MaxKeys: 2,
    });

    const response = await s3Client.send(command);
    const contents = response.Contents || [];

    const hasOnlyPlaceholder =
      contents.length === 0 ||
      (contents.length === 1 && contents[0].Key === normalizedPrefix);

    return hasOnlyPlaceholder;
  }

  public async deleteFolder(prefix: string): Promise<{ success: boolean; error?: string }> {
    const isEmpty = await this.isFolderEmpty(prefix);

    if (!isEmpty) {
      return { success: false, error: "FOLDER_NOT_EMPTY" };
    }

    const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: normalizedPrefix,
    });

    await s3Client.send(command);
    return { success: true };
  }

  public async createFolder(path: string, folderName: string): Promise<void> {
    const normalizedPath = path ? (path.endsWith("/") ? path : `${path}/`) : "";
    const folderKey = `${normalizedPath}${folderName}/`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: folderKey,
      Body: "",
    });

    await s3Client.send(command);
  }

  public async getUploadUrl(
    path: string,
    fileName: string,
    contentType: string
  ): Promise<{ url: string; key: string }> {
    const normalizedPath = path ? (path.endsWith("/") ? path : `${path}/`) : "";
    const key = `${normalizedPath}${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { url, key };
  }

  public async renameObject(
    oldKey: string,
    newName: string
  ): Promise<{ success: boolean; newKey?: string; error?: string }> {
    const parts = oldKey.split("/");
    parts[parts.length - 1] = newName;
    const newKey = parts.join("/");

    if (oldKey === newKey) {
      return { success: true, newKey };
    }

    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${oldKey}`,
        Key: newKey,
      });

      await s3Client.send(copyCommand);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: oldKey,
      });

      await s3Client.send(deleteCommand);

      return { success: true, newKey };
    } catch (error) {
      console.error("Error renaming object:", error);
      return { success: false, error: "RENAME_FAILED" };
    }
  }

  public async renameFolder(
    oldPrefix: string,
    newName: string
  ): Promise<{ success: boolean; newPrefix?: string; error?: string }> {
    const normalizedOldPrefix = oldPrefix.endsWith("/") ? oldPrefix : `${oldPrefix}/`;

    const parts = normalizedOldPrefix.slice(0, -1).split("/");
    parts[parts.length - 1] = newName;
    const newPrefix = parts.join("/") + "/";

    if (normalizedOldPrefix === newPrefix) {
      return { success: true, newPrefix };
    }

    try {
      const allObjects = await this.listAllObjectsInFolder(normalizedOldPrefix);

      for (const obj of allObjects) {
        const newKey = obj.Key!.replace(normalizedOldPrefix, newPrefix);

        const copyCommand = new CopyObjectCommand({
          Bucket: this.bucket,
          CopySource: `${this.bucket}/${obj.Key}`,
          Key: newKey,
        });

        await s3Client.send(copyCommand);
      }

      for (const obj of allObjects) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: obj.Key!,
        });

        await s3Client.send(deleteCommand);
      }

      return { success: true, newPrefix };
    } catch (error) {
      console.error("Error renaming folder:", error);
      return { success: false, error: "RENAME_FOLDER_FAILED" };
    }
  }

  private async listAllObjectsInFolder(prefix: string): Promise<_Object[]> {
    const allObjects: _Object[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(command);

      if (response.Contents) {
        allObjects.push(...response.Contents);
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return allObjects;
  }

  private getFileName(key: string, prefix: string): string {
    return key.replace(prefix, "");
  }

  private getFolderName(prefix: string): string {
    const parts = prefix.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }

  private getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return "";
  }
}
