import bcrypt from "bcryptjs";
import { UserRepository } from "../repository/user.repository";
import { UserValidationService } from "../validations/user.validation.service";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ProfileValidationResult extends DomainValidationResult {
  data?: UpdateProfileInput;
}

export interface EmailValidationResult extends DomainValidationResult {
  data?: UpdateEmailInput;
  requiresVerification?: boolean;
}

export interface PasswordValidationResult extends DomainValidationResult {
  data?: UpdatePasswordInput;
}

export interface DeleteValidationResult extends DomainValidationResult {
  data?: DeleteAccountInput;
}

export class UserDomainService {
  private repository: UserRepository;
  private validationService: UserValidationService;

  constructor() {
    this.repository = new UserRepository();
    this.validationService = new UserValidationService();
  }

  public async validateProfileUpdate(
    userId: string,
    input: UpdateProfileInput
  ): Promise<ProfileValidationResult> {
    const validation = this.validationService.validateProfileData(input);
    if (!validation.isValid) {
      return { isValid: false, error: validation.error };
    }

    if (input.userName) {
      const existingUser = await this.repository.findByUserName(input.userName);
      if (existingUser && existingUser.id !== userId) {
        return {
          isValid: false,
          error: "Este nombre de usuario ya está en uso",
        };
      }
    }

    return { isValid: true, data: validation.data };
  }

  public async validateEmailUpdate(
    userId: string,
    input: UpdateEmailInput
  ): Promise<EmailValidationResult> {
    const validation = this.validationService.validateEmailData(input);
    if (!validation.isValid) {
      return { isValid: false, error: validation.error };
    }

    const user = await this.repository.getUserWithPassword(userId);
    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (!user.password) {
      return {
        isValid: false,
        error: "Tu cuenta no tiene una contraseña configurada",
      };
    }

    const passwordMatch = await bcrypt.compare(
      input.currentPassword,
      user.password
    );
    if (!passwordMatch) {
      return { isValid: false, error: "Contraseña incorrecta" };
    }

    if (user.email === input.email) {
      return { isValid: false, error: "Ya estás usando este correo" };
    }

    const existingEmail = await this.repository.findByEmail(input.email);
    if (existingEmail && existingEmail.id !== userId) {
      return {
        isValid: false,
        error: "Este correo ya está registrado con otra cuenta",
      };
    }

    return {
      isValid: true,
      data: validation.data,
      requiresVerification: true,
    };
  }

  public async validatePasswordUpdate(
    userId: string,
    input: UpdatePasswordInput
  ): Promise<PasswordValidationResult> {
    const validation = this.validationService.validatePasswordData(input);
    if (!validation.isValid) {
      return { isValid: false, error: validation.error };
    }

    const user = await this.repository.getUserWithPassword(userId);
    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (!user.password) {
      return {
        isValid: false,
        error: "Tu cuenta no tiene una contraseña configurada",
      };
    }

    const passwordMatch = await bcrypt.compare(
      input.currentPassword,
      user.password
    );
    if (!passwordMatch) {
      return { isValid: false, error: "Contraseña actual incorrecta" };
    }

    if (input.currentPassword === input.newPassword) {
      return {
        isValid: false,
        error: "La nueva contraseña debe ser diferente a la actual",
      };
    }

    return { isValid: true, data: validation.data };
  }

  public async validateDeleteAccount(
    userId: string,
    input: DeleteAccountInput
  ): Promise<DeleteValidationResult> {
    const validation = this.validationService.validateDeleteData(input);
    if (!validation.isValid) {
      return { isValid: false, error: validation.error };
    }

    const user = await this.repository.getUserWithPassword(userId);
    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (!user.password) {
      return {
        isValid: false,
        error: "Tu cuenta no tiene una contraseña configurada",
      };
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      return { isValid: false, error: "Contraseña incorrecta" };
    }

    return { isValid: true, data: validation.data };
  }
}
