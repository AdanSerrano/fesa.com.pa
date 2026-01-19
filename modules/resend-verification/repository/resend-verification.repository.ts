import { db } from "@/utils/db";

export class ResendVerificationRepository {
  public async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }
}
