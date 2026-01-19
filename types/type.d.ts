import { Role } from "@/app/prisma/enums";

declare module "next-auth" {
  interface User {
    id?: string;
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }

  interface Account {}

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      userName?: string | null;
      image?: string | null;
      role?: Role | null;
      isTwoFactorEnabled?: boolean;
    };
    expires: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    idToken?: string;
    isTwoFactorEnabled?: boolean;
    userName?: string | null;
    role?: Role | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}
