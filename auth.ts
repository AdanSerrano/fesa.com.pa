import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import { Role } from "./app/prisma/enums";
import authConfig from "./auth.config";
import { db } from "./utils/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await db.user.findUnique({ where: { id: user.id } });
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        session.user.userName = token.userName as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as Role;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userName = user.userName ?? undefined;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        return token;
      }

      if (trigger === "update") {
        if (session?.user) {
          if (session.user.name !== undefined) token.name = session.user.name;
          if (session.user.userName !== undefined)
            token.userName = session.user.userName;
          if (session.user.image !== undefined) token.image = session.user.image;
          if (session.user.email !== undefined) token.email = session.user.email;
          if (session.user.isTwoFactorEnabled !== undefined)
            token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
        } else if (token.sub) {
          const existingUser = await db.user.findUnique({
            where: { id: token.sub },
          });
          if (existingUser) {
            token.userName = existingUser.userName ?? undefined;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.image = existingUser.image;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
          }
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  ...authConfig,
});
