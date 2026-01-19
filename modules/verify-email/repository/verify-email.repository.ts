import { db } from "@/utils/db";

export class VerifyEmailRepository {
  public async getVerificationToken(token: string) {
    return await db.verificationToken.findUnique({
      where: { token },
    });
  }

  public async getUserByEmail(email: string) {
    return await db.user.findFirst({
      where: { email },
    });
  }

  public async markEmailAsVerified(userId: string, email: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
        email,
      },
    });
  }

  public async deleteVerificationToken(tokenId: string) {
    return await db.verificationToken.delete({
      where: { id: tokenId },
    });
  }
}
