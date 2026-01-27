"use client";

import { memo, useMemo } from "react";
import type { Control } from "react-hook-form";
import {
  FormAddressField,
  FormCoordinatesField,
} from "@/components/ui/form-fields";

interface LocationSectionProps {
  control: Control<any>;
}

function LocationSectionComponent({ control }: LocationSectionProps) {
  const countries = useMemo(
    () => [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "MX", label: "Mexico" },
      { value: "GB", label: "United Kingdom" },
      { value: "DE", label: "Germany" },
      { value: "FR", label: "France" },
      { value: "ES", label: "Spain" },
    ],
    []
  );

  const states = useMemo(
    () => [
      { value: "CA", label: "California", country: "US" },
      { value: "NY", label: "New York", country: "US" },
      { value: "TX", label: "Texas", country: "US" },
      { value: "FL", label: "Florida", country: "US" },
      { value: "ON", label: "Ontario", country: "CA" },
      { value: "BC", label: "British Columbia", country: "CA" },
      { value: "QC", label: "Quebec", country: "CA" },
      { value: "CDMX", label: "Ciudad de México", country: "MX" },
      { value: "JAL", label: "Jalisco", country: "MX" },
      { value: "NL", label: "Nuevo León", country: "MX" },
    ],
    []
  );

  return (
    <div className="grid gap-6">
      <FormAddressField
        control={control}
        name="addressField"
        label="Address Field"
        description="Complete address with auto-fill support"
        countries={countries}
        states={states}
        showApartment
      />

      <FormCoordinatesField
        control={control}
        name="coordinatesField"
        label="Coordinates Field"
        description="Latitude and longitude with geolocation"
        showGetLocation
        precision={6}
      />
    </div>
  );
}

export const LocationSection = memo(LocationSectionComponent);
LocationSection.displayName = "LocationSection";
