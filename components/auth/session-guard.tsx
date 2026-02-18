"use client";

import { memo, useMemo, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

interface ExtendedSession {
  sessionRevoked?: boolean;
}

function SessionGuardComponent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoggingOut = useRef(false);

  const isRevoked = useMemo(() => {
    const extendedSession = session as ExtendedSession | null;
    return status === "authenticated" && !!extendedSession?.sessionRevoked;
  }, [session, status]);

  if (isRevoked && !isLoggingOut.current) {
    isLoggingOut.current = true;
    signOut({ callbackUrl: "/login?sessionExpired=true", redirect: true });
  }

  return <>{children}</>;
}

export const SessionGuard = memo(SessionGuardComponent);
SessionGuard.displayName = "SessionGuard";
