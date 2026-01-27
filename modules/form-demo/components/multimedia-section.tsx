"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormImageCropField,
  FormAvatarField,
  FormSignatureField,
} from "@/components/ui/form-fields";

interface MultimediaSectionProps {
  control: Control<any>;
}

function MultimediaSectionComponent({ control }: MultimediaSectionProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormImageCropField
        control={control}
        name="imageCropField"
        label="Image Crop Field"
        description="Upload and crop an image"
        aspectRatio={16 / 9}
        maxFileSize={5 * 1024 * 1024}
      />

      <FormAvatarField
        control={control}
        name="avatarField"
        label="Avatar Field"
        description="Upload a profile picture"
        size="xl"
        fallback="JD"
      />

      <FormSignatureField
        control={control}
        name="signatureField"
        label="Signature Field"
        description="Draw your signature"
        className="md:col-span-2"
        strokeColor="#000000"
        strokeWidth={2}
      />
    </div>
  );
}

export const MultimediaSection = memo(MultimediaSectionComponent);
MultimediaSection.displayName = "MultimediaSection";
