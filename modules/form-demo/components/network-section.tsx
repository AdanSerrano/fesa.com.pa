"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormUrlField,
  FormSocialField,
  FormIPAddressField,
} from "@/components/ui/form-fields";

interface NetworkSectionProps {
  control: Control<any>;
}

function NetworkSectionComponent({ control }: NetworkSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormUrlField
        control={control}
        name="urlField"
        label="URL Field"
        placeholder="https://example.com"
        description="Website URL with validation"
        showValidation
        showOpenLink
        showFavicon
      />

      <FormSocialField
        control={control}
        name="socialField"
        label="Social Media Field"
        description="Social media handle"
        defaultPlatform="twitter"
        showPlatformSelector
        showOpenLink
      />

      <FormIPAddressField
        control={control}
        name="ipAddressField"
        label="IP Address Field"
        placeholder="192.168.1.1"
        description="IPv4 or IPv6 address"
        version="ipv4"
      />
    </div>
  );
}

export const NetworkSection = memo(NetworkSectionComponent);
NetworkSection.displayName = "NetworkSection";
