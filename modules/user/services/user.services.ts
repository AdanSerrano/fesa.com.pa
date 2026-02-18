import bcrypt from "bcryptjs";
import { UserRepository, UserProfileData } from "../repository/user.repository";
import { UserDomainService } from "./user.domain.service";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";
import { generateVerificationToken } from "@/lib/tokens";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@/app/prisma/enums";
import { FileUploadS3Service } from "@/modules/file-upload/services/file-upload.s3.service";
import { FileVisibility } from "@/modules/file-upload/types/file-upload.types";

export interface UserResult {
  success?: string;
  error?: string;
  data?: unknown;
  requiresVerification?: boolean;
  requiresLogout?: boolean;
}

export interface GetProfileResult {
  success?: string;
  error?: string;
  data?: UserProfileData;
}

export interface DeletionStatusResult {
  success?: string;
  error?: string;
  isPendingDeletion?: boolean;
  scheduledDeletionDate?: Date | null;
  daysRemaining?: number;
}

const BCRYPT_SALT_ROUNDS = 10;

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB

export class UserService {
  private repository: UserRepository;
  private domainService: UserDomainService;
  private s3Service: FileUploadS3Service;

  constructor() {
    this.repository = new UserRepository();
    this.domainService = new UserDomainService();
    this.s3Service = new FileUploadS3Service();
  }

  public async getProfile(userId: string): Promise<GetProfileResult> {
    try {
      const user = await this.repository.findById(userId);

      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      return { data: user };
    } catch {
      return { error: "Error al obtener el perfil" };
    }
  }

  public async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateProfileUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const updatedUser = await this.repository.updateProfile(userId, {
        name: validation.data?.name,
        userName: validation.data?.userName,
        image: validation.data?.image,
      });

      return {
        success: "Perfil actualizado correctamente",
        data: updatedUser,
      };
    } catch {
      return { error: "Error al actualizar el perfil" };
    }
  }

  public async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<UserResult> {
    try {
      const updatedUser = await this.repository.updateProfile(userId, {
        image: imageUrl,
      });

      return {
        success: "Imagen de perfil actualizada",
        data: updatedUser,
      };
    } catch {
      return { error: "Error al actualizar la imagen de perfil" };
    }
  }

  private getFileExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };
    return extensions[mimeType] || ".jpg";
  }

  public async getAvatarUploadUrl(
    userId: string,
    input: { fileType: string; fileSize: number }
  ): Promise<UserResult> {
    try {
      // Validate file type
      if (!ALLOWED_AVATAR_TYPES.includes(input.fileType)) {
        return { error: "Tipo de archivo no permitido. Usa JPG, PNG, GIF o WebP" };
      }

      // Validate file size
      if (input.fileSize > MAX_AVATAR_SIZE) {
        return { error: "El archivo es muy grande. Máximo 5MB" };
      }

      // Generate predictable file key: users/avatars/[userId].[ext]
      const extension = this.getFileExtension(input.fileType);
      const fileKey = `users/avatars/${userId}${extension}`;

      const { url, expiresAt } = await this.s3Service.generateUploadUrl({
        fileKey,
        mimeType: input.fileType,
        fileSize: input.fileSize,
        visibility: FileVisibility.PUBLIC,
      });

      return {
        success: "URL de subida generada",
        data: {
          uploadUrl: url,
          fileKey,
          expiresAt,
        },
      };
    } catch {
      return { error: "Error al generar URL de subida" };
    }
  }

  public async confirmAvatarUpload(
    userId: string,
    input: { fileKey: string; mimeType: string; fileSize: number }
  ): Promise<UserResult> {
    try {
      // Verify file exists in S3
      const exists = await this.s3Service.verifyFileExists(
        input.fileKey,
        FileVisibility.PUBLIC
      );

      if (!exists) {
        return { error: "Archivo no encontrado en el servidor" };
      }

      // Get public URL with cache-busting parameter
      const baseUrl = this.s3Service.getPublicUrl(input.fileKey);

      if (!baseUrl) {
        return { error: "Error al obtener URL pública" };
      }

      // Add timestamp to prevent browser caching
      const publicUrl = `${baseUrl}?v=${Date.now()}`;

      // Update user profile with new image URL
      const updatedUser = await this.repository.updateProfile(userId, {
        image: publicUrl,
      });

      return {
        success: "Imagen de perfil actualizada",
        data: {
          publicUrl,
          user: updatedUser,
        },
      };
    } catch {
      return { error: "Error al confirmar subida de avatar" };
    }
  }

  public async updateEmail(
    userId: string,
    input: UpdateEmailInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateEmailUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.updateEmail(userId, {
        email: validation.data!.email,
        emailVerified: null,
      });

      const verificationToken = await generateVerificationToken(
        validation.data!.email
      );

      return {
        success: "Email actualizado. Revisa tu correo para verificarlo.",
        requiresVerification: true,
        data: { token: verificationToken.token },
      };
    } catch {
      return { error: "Error al actualizar el email" };
    }
  }

  public async updatePassword(
    userId: string,
    input: UpdatePasswordInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validatePasswordUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const hashedPassword = await bcrypt.hash(
        validation.data!.newPassword,
        BCRYPT_SALT_ROUNDS
      );

      await this.repository.updatePassword(userId, hashedPassword);

      await logAuditEvent({
        userId,
        action: AuditAction.PASSWORD_RESET_COMPLETED,
        metadata: { method: "profile_update" },
      });

      return {
        success: "Contraseña actualizada correctamente",
      };
    } catch {
      return { error: "Error al actualizar la contraseña" };
    }
  }

  public async scheduleAccountDeletion(
    userId: string,
    input: DeleteAccountInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateDeleteAccount(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const result = await this.repository.scheduleAccountDeletion(userId);

      await logAuditEvent({
        userId,
        action: AuditAction.ACCOUNT_DELETION_REQUESTED,
        metadata: {
          scheduledDeletionDate: result.scheduledDeletionDate,
        },
      });

      const formattedDate = result.scheduledDeletionDate
        ? new Intl.DateTimeFormat("es", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(result.scheduledDeletionDate)
        : "";

      return {
        success: `Tu cuenta será eliminada el ${formattedDate}. Puedes reactivarla iniciando sesión antes de esa fecha.`,
        requiresLogout: true,
      };
    } catch {
      return { error: "Error al programar la eliminación de la cuenta" };
    }
  }

  public async cancelAccountDeletion(userId: string): Promise<UserResult> {
    try {
      await this.repository.cancelAccountDeletion(userId);

      await logAuditEvent({
        userId,
        action: AuditAction.ACCOUNT_DELETION_CANCELLED,
      });

      return {
        success: "¡Tu cuenta ha sido reactivada exitosamente!",
      };
    } catch {
      return { error: "Error al reactivar la cuenta" };
    }
  }

  public async getDeletionStatus(userId: string): Promise<DeletionStatusResult> {
    try {
      const status = await this.repository.getUserDeletionStatus(userId);

      if (!status) {
        return { error: "Usuario no encontrado" };
      }

      if (!status.deletedAt || !status.scheduledDeletionDate) {
        return { isPendingDeletion: false };
      }

      const now = new Date();
      const scheduledDate = new Date(status.scheduledDeletionDate);
      const daysRemaining = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        isPendingDeletion: true,
        scheduledDeletionDate: status.scheduledDeletionDate,
        daysRemaining: Math.max(0, daysRemaining),
      };
    } catch {
      return { error: "Error al obtener el estado de eliminación" };
    }
  }

  public async getDeletionStatusByEmail(email: string): Promise<DeletionStatusResult> {
    try {
      const status = await this.repository.getUserDeletionStatusByEmail(email);

      if (!status) {
        return { isPendingDeletion: false };
      }

      if (!status.deletedAt || !status.scheduledDeletionDate) {
        return { isPendingDeletion: false };
      }

      const now = new Date();
      const scheduledDate = new Date(status.scheduledDeletionDate);
      const daysRemaining = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        isPendingDeletion: true,
        scheduledDeletionDate: status.scheduledDeletionDate,
        daysRemaining: Math.max(0, daysRemaining),
      };
    } catch {
      return { error: "Error al obtener el estado de eliminación" };
    }
  }

  public async reactivateAccountByEmail(email: string): Promise<UserResult> {
    try {
      const status = await this.repository.getUserDeletionStatusByEmail(email);

      if (!status) {
        return { error: "Usuario no encontrado" };
      }

      if (!status.deletedAt) {
        return { error: "La cuenta no está pendiente de eliminación" };
      }

      await this.repository.cancelAccountDeletion(status.id);

      await logAuditEvent({
        userId: status.id,
        action: AuditAction.ACCOUNT_DELETION_CANCELLED,
        metadata: { reactivatedViaLogin: true },
      });

      return {
        success: "¡Tu cuenta ha sido reactivada! Ya puedes iniciar sesión.",
      };
    } catch {
      return { error: "Error al reactivar la cuenta" };
    }
  }
}
