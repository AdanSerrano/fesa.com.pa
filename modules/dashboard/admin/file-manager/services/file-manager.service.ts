import {
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
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
