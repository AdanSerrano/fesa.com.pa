"use client";

import { memo, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

interface ExtendedSession {
  sessionRevoked?: boolean;
}

function SessionGuardComponent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    const extendedSession = session as ExtendedSession | null;

    if (
      status === "authenticated" &&
      extendedSession?.sessionRevoked &&
      !isLoggingOut.current
    ) {
      isLoggingOut.current = true;

      signOut({
        callbackUrl: "/login?sessionExpired=true",
        redirect: true,
      });
    }
  }, [session, status]);

  return <>{children}</>;
}

export const SessionGuard = memo(SessionGuardComponent);
SessionGuard.displayName = "SessionGuard";
