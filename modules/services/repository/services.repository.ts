import { auth } from "@/auth";

export class ServicesRepository {
  public async getCurrentSession() {
    return await auth();
  }
}
