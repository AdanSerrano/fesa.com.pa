import { db } from "@/utils/db";

export class ForgotPasswordRepository {
  public async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
    });
  }
}
