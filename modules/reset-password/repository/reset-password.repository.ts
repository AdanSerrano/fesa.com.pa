import { db } from "@/utils/db";

export class ResetPasswordRepository {
  public async getPasswordResetTokenByToken(token: string) {
    return await db.passwordResetToken.findUnique({
      where: { token },
    });
  }

  public async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
    });
  }

  public async updateUserPassword(userId: string, hashedPassword: string) {
    return await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  public async deletePasswordResetToken(tokenId: string) {
    return await db.passwordResetToken.delete({
      where: { id: tokenId },
    });
  }
}
