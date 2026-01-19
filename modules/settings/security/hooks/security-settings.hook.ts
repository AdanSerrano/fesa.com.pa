"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getSecurityInfoAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
} from "../actions/security-settings.actions";
import type { SecurityInfo } from "../services/security-settings.services";

export function useSecuritySettings() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSecurityInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSecurityInfoAction();

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        setSecurityInfo(result.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al cargar información";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSecurityInfo();
  }, [loadSecurityInfo]);

  const handleEnableTwoFactor = useCallback(() => {
    startTransition(async () => {
      const result = await enableTwoFactorAction();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      await loadSecurityInfo();
    });
  }, [loadSecurityInfo]);

  const handleDisableTwoFactor = useCallback(() => {
    startTransition(async () => {
      const result = await disableTwoFactorAction();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      await loadSecurityInfo();
    });
  }, [loadSecurityInfo]);

  const refreshSecurityInfo = useCallback(() => {
    startTransition(async () => {
      await loadSecurityInfo();
    });
  }, [loadSecurityInfo]);

  return {
    securityInfo,
    isLoading,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  };
}
