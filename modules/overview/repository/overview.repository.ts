import { auth } from "@/auth";

export class OverviewRepository {
  public async getCurrentSession() {
    return await auth();
  }
}
