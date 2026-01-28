import { OverviewRepository } from "../repository/overview.repository";

export interface UserSession {
  id: string;
  name: string | null;
  userName: string | null;
  email: string | null;
  image: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
}

export interface OverviewResult {
  user?: UserSession;
  error?: string;
}

export class OverviewService {
  private repository: OverviewRepository;

  constructor() {
    this.repository = new OverviewRepository();
  }

  public async getUserSession(): Promise<OverviewResult> {
    try {
      const session = await this.repository.getCurrentSession();

      if (!session?.user) {
        return { error: "No hay sesión activa" };
      }

      const { user } = session;

      return {
        user: {
          id: user.id ?? "",
          name: user.name ?? null,
          userName: user.userName ?? null,
          email: user.email ?? null,
          image: user.image ?? null,
          role: user.role ?? "USER",
          isTwoFactorEnabled: user.isTwoFactorEnabled ?? false,
        },
      };
    } catch (error) {
      console.error("Error getting user session:", error);
      return { error: "Error al obtener la sesión" };
    }
  }
}
