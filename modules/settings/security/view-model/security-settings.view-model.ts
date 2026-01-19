import { useSecuritySettings } from "../hooks/security-settings.hook";

export function SecuritySettingsViewModel() {
  const {
    securityInfo,
    isLoading,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  } = useSecuritySettings();

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
