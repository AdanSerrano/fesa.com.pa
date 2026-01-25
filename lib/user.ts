import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/utils/db";

/**
 * Per-request cached full session (includes sessionToken).
 * Use when you need access to the full session object.
 * React.cache() deduplicates within a single request.
 * @see https://react.dev/reference/react/cache
 */
export const currentSession = cache(async () => {
  return await auth();
});

/**
 * Per-request cached auth user.
 * React.cache() deduplicates within a single request - multiple components
 * calling this will share the same result (no duplicate auth() calls).
 * @see https://react.dev/reference/react/cache
 */
export const currentUser = cache(async () => {
  const session = await currentSession();
  return session?.user;
});

/**
 * @deprecated Use currentUser() directly
 */
export const getUser = currentUser;

/**
 * Per-request cached user lookup by ID.
 * Deduplicates database queries within the same request.
 */
export const getUserById = cache(async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
  });
  return user;
});

/**
 * Per-request cached user lookup by email.
 * Deduplicates database queries within the same request.
 */
export const getUserByEmail = cache(async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });
  return user;
});

/**
 * Per-request cached user lookup by userName.
 * Deduplicates database queries within the same request.
 */
export const getUserByUserName = cache(async (userName: string) => {
  const user = await db.user.findUnique({
    where: { userName },
  });
  return user;
});;