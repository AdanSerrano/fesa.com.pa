"use client";

import { memo, useCallback, useMemo } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Locate, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface CoordinatesValue {
  latitude: number | null;
  longitude: number | null;
}

export interface FormCoordinatesFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  showGetLocation?: boolean;
  showOpenMap?: boolean;
  showCopy?: boolean;
  precision?: number;
  mapProvider?: "google" | "openstreetmap";
  labels?: {
    latitude?: string;
    longitude?: string;
    getLocation?: string;
    openMap?: string;
    copy?: string;
  };
}

const DEFAULT_LABELS = {
  latitude: "Latitude",
  longitude: "Longitude",
  getLocation: "Get my location",
  openMap: "View on map",
  copy: "Copy",
};

function FormCoordinatesFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  required,
  showGetLocation = true,
  showOpenMap = true,
  showCopy = true,
  precision = 6,
  mapProvider = "google",
  labels: customLabels,
}: FormCoordinatesFieldProps<TFieldValues, TName>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);

  const formatCoordinate = useCallback(
    (value: number | null | undefined): string => {
      if (value === null || value === undefined) return "";
      return value.toFixed(precision);
    },
    [precision]
  );

  const parseCoordinate = useCallback((value: string): number | null => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return null;
    return parsed;
  }, []);

  const getMapUrl = useCallback(
    (lat: number, lng: number): string => {
      if (mapProvider === "openstreetmap") {
        return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
      }
      return `https://www.google.com/maps?q=${lat},${lng}`;
    },
    [mapProvider]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value || { latitude: null, longitude: null }) as CoordinatesValue;

        const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const lat = parseCoordinate(e.target.value);
          field.onChange({ ...value, latitude: lat });
        };

        const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const lng = parseCoordinate(e.target.value);
          field.onChange({ ...value, longitude: lng });
        };

        const handleGetLocation = () => {
          if (!navigator.geolocation) return;

          navigator.geolocation.getCurrentPosition(
            (position) => {
              field.onChange({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true }
          );
        };

        const handleOpenMap = () => {
          if (value.latitude !== null && value.longitude !== null) {
            window.open(getMapUrl(value.latitude, value.longitude), "_blank");
          }
        };

        const handleCopy = () => {
          if (value.latitude !== null && value.longitude !== null) {
            navigator.clipboard.writeText(`${value.latitude}, ${value.longitude}`);
          }
        };

        const hasCoordinates = value.latitude !== null && value.longitude !== null;
        const isValidLat =
          value.latitude === null || (value.latitude >= -90 && value.latitude <= 90);
        const isValidLng =
          value.longitude === null || (value.longitude >= -180 && value.longitude <= 180);

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        {labels.latitude}
                      </label>
                      <Input
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        value={formatCoordinate(value.latitude)}
                        onChange={handleLatChange}
                        placeholder="-90 to 90"
                        disabled={disabled}
                        className={cn(
                          "bg-background",
                          (!isValidLat || fieldState.error) && "border-destructive"
                        )}
                      />
                      {!isValidLat && (
                        <p className="text-xs text-destructive">Must be between -90 and 90</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        {labels.longitude}
                      </label>
                      <Input
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        value={formatCoordinate(value.longitude)}
                        onChange={handleLngChange}
                        placeholder="-180 to 180"
                        disabled={disabled}
                        className={cn(
                          "bg-background",
                          (!isValidLng || fieldState.error) && "border-destructive"
                        )}
                      />
                      {!isValidLng && (
                        <p className="text-xs text-destructive">Must be between -180 and 180</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {showGetLocation && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetLocation}
                      disabled={disabled}
                    >
                      <Locate className="h-4 w-4 mr-2" />
                      {labels.getLocation}
                    </Button>
                  )}
                  {showOpenMap && hasCoordinates && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleOpenMap}
                      disabled={disabled}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {labels.openMap}
                    </Button>
                  )}
                  {showCopy && hasCoordinates && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={disabled}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {labels.copy}
                    </Button>
                  )}
                </div>
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export const FormCoordinatesField = memo(
  FormCoordinatesFieldComponent
) as typeof FormCoordinatesFieldComponent;
