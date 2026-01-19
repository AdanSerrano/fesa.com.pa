import { sendVerificationEmail } from "../emails/resend-verification.emails";
import { generateVerificationToken } from "@/lib/tokens";
import { checkRateLimit, formatResetTime } from "@/lib/rate-limit";
import { ResendVerificationDomainService } from "./resend-verification.domain.service";
import { ResendVerificationInput } from "../validations/schema/resend-verification.schema";

const GENERIC_SUCCESS_MESSAGE =
  "Si existe una cuenta con ese email, recibirás un enlace de verificación.";

export interface ResendVerificationResult {
  success?: string;
  error?: string;
  rateLimited?: boolean;
}

export class ResendVerificationService {
  private domainService: ResendVerificationDomainService;

  constructor() {
    this.domainService = new ResendVerificationDomainService();
  }

  public async resend(
    input: ResendVerificationInput
  ): Promise<ResendVerificationResult> {
    try {
      const rateLimitKey = `resend-verification:${input.email.toLowerCase()}`;
      const rateLimit = checkRateLimit(rateLimitKey);

      if (!rateLimit.allowed) {
        return {
          error: `Demasiados intentos. Intenta de nuevo en ${formatResetTime(rateLimit.resetIn)}.`,
          rateLimited: true,
        };
      }

      const validation =
        await this.domainService.validateResendRequest(input);

      if (!validation.isValid) {
        return { error: validation.error };
      }

      if (!validation.shouldSendEmail) {
        return { success: GENERIC_SUCCESS_MESSAGE };
      }

      const verificationToken = await generateVerificationToken(
        validation.email!
      );
      await sendVerificationEmail(validation.email!, verificationToken.token);

      return { success: GENERIC_SUCCESS_MESSAGE };
    } catch (error) {
      console.error("Error en resend verification service:", error);
      return { error: "Error al enviar el correo de verificación" };
    }
  }
}
