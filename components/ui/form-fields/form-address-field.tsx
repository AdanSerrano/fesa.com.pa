"use client";

import { memo, useCallback, useMemo } from "react";
import type { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Building2, Home, Hash, Globe, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

export interface AddressValue {
  street?: string;
  number?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FormAddressFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<BaseFormFieldProps<TFieldValues, TName>, "placeholder"> {
  showApartment?: boolean;
  showState?: boolean;
  countries?: { value: string; label: string }[];
  states?: { value: string; label: string; country?: string }[];
  layout?: "stacked" | "inline";
  labels?: {
    street?: string;
    number?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  placeholders?: {
    street?: string;
    number?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const DEFAULT_LABELS = {
  street: "Street",
  number: "Number",
  apartment: "Apt/Suite",
  city: "City",
  state: "State/Province",
  postalCode: "Postal Code",
  country: "Country",
};

const DEFAULT_PLACEHOLDERS = {
  street: "123 Main Street",
  number: "123",
  apartment: "Apt 4B",
  city: "New York",
  state: "Select state",
  postalCode: "10001",
  country: "Select country",
};

const DEFAULT_COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "MX", label: "Mexico" },
  { value: "GB", label: "United Kingdom" },
  { value: "ES", label: "Spain" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "IT", label: "Italy" },
  { value: "BR", label: "Brazil" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
];

const AddressInput = memo(function AddressInput({
  icon: Icon,
  label,
  value,
  placeholder,
  onChange,
  disabled,
  className,
  error,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("bg-background", error && "border-destructive")}
      />
    </div>
  );
});

const AddressSelect = memo(function AddressSelect({
  icon: Icon,
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  className,
  error,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn("bg-background", error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

interface AddressContentProps {
  field: ControllerRenderProps<FieldValues, string>;
  hasError: boolean;
  disabled?: boolean;
  showApartment: boolean;
  showState: boolean;
  countries: { value: string; label: string }[];
  states: { value: string; label: string; country?: string }[];
  layout: "stacked" | "inline";
  labels: typeof DEFAULT_LABELS;
  placeholders: typeof DEFAULT_PLACEHOLDERS;
  updateField: (
    currentValue: AddressValue | undefined,
    key: keyof AddressValue,
    newValue: string,
    onChange: (value: AddressValue) => void
  ) => void;
}

const AddressContent = memo(function AddressContent({
  field,
  hasError,
  disabled,
  showApartment,
  showState,
  countries,
  states,
  layout,
  labels,
  placeholders,
  updateField,
}: AddressContentProps) {
  const value = (field.value || {}) as AddressValue;

  const filteredStates = useMemo(
    () =>
      value.country
        ? states.filter((s) => !s.country || s.country === value.country)
        : states,
    [value.country, states]
  );

  if (layout === "inline") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AddressInput
          icon={Home}
          label={labels.street}
          value={value.street || ""}
          placeholder={placeholders.street}
          onChange={(v) => updateField(value, "street", v, field.onChange)}
          disabled={disabled}
          className="col-span-2"
          error={hasError}
        />
        <AddressInput
          icon={Hash}
          label={labels.number}
          value={value.number || ""}
          placeholder={placeholders.number}
          onChange={(v) => updateField(value, "number", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
        {showApartment && (
          <AddressInput
            icon={Building2}
            label={labels.apartment}
            value={value.apartment || ""}
            placeholder={placeholders.apartment}
            onChange={(v) => updateField(value, "apartment", v, field.onChange)}
            disabled={disabled}
            error={hasError}
          />
        )}
        <AddressInput
          icon={MapPin}
          label={labels.city}
          value={value.city || ""}
          placeholder={placeholders.city}
          onChange={(v) => updateField(value, "city", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
        {showState && (
          <AddressInput
            icon={Map}
            label={labels.state}
            value={value.state || ""}
            placeholder={placeholders.state}
            onChange={(v) => updateField(value, "state", v, field.onChange)}
            disabled={disabled}
            error={hasError}
          />
        )}
        <AddressInput
          icon={Hash}
          label={labels.postalCode}
          value={value.postalCode || ""}
          placeholder={placeholders.postalCode}
          onChange={(v) => updateField(value, "postalCode", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
        <AddressSelect
          icon={Globe}
          label={labels.country}
          value={value.country || ""}
          placeholder={placeholders.country}
          options={countries}
          onChange={(v) => updateField(value, "country", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <AddressInput
          icon={Home}
          label={labels.street}
          value={value.street || ""}
          placeholder={placeholders.street}
          onChange={(v) => updateField(value, "street", v, field.onChange)}
          disabled={disabled}
          className="sm:col-span-2"
          error={hasError}
        />
        <AddressInput
          icon={Hash}
          label={labels.number}
          value={value.number || ""}
          placeholder={placeholders.number}
          onChange={(v) => updateField(value, "number", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
      </div>
      {showApartment && (
        <AddressInput
          icon={Building2}
          label={labels.apartment}
          value={value.apartment || ""}
          placeholder={placeholders.apartment}
          onChange={(v) => updateField(value, "apartment", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AddressInput
          icon={MapPin}
          label={labels.city}
          value={value.city || ""}
          placeholder={placeholders.city}
          onChange={(v) => updateField(value, "city", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
        {showState &&
          (filteredStates.length > 0 ? (
            <AddressSelect
              icon={Map}
              label={labels.state}
              value={value.state || ""}
              placeholder={placeholders.state}
              options={filteredStates}
              onChange={(v) => updateField(value, "state", v, field.onChange)}
              disabled={disabled}
              error={hasError}
            />
          ) : (
            <AddressInput
              icon={Map}
              label={labels.state}
              value={value.state || ""}
              placeholder={placeholders.state}
              onChange={(v) => updateField(value, "state", v, field.onChange)}
              disabled={disabled}
              error={hasError}
            />
          ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AddressInput
          icon={Hash}
          label={labels.postalCode}
          value={value.postalCode || ""}
          placeholder={placeholders.postalCode}
          onChange={(v) => updateField(value, "postalCode", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
        <AddressSelect
          icon={Globe}
          label={labels.country}
          value={value.country || ""}
          placeholder={placeholders.country}
          options={countries}
          onChange={(v) => updateField(value, "country", v, field.onChange)}
          disabled={disabled}
          error={hasError}
        />
      </div>
    </>
  );
});

function FormAddressFieldComponent<
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
  showApartment = true,
  showState = true,
  countries = DEFAULT_COUNTRIES,
  states = [],
  layout = "stacked",
  labels: customLabels,
  placeholders: customPlaceholders,
}: FormAddressFieldProps<TFieldValues, TName>) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...customLabels }), [customLabels]);
  const placeholders = useMemo(
    () => ({ ...DEFAULT_PLACEHOLDERS, ...customPlaceholders }),
    [customPlaceholders]
  );

  const updateField = useCallback(
    (
      currentValue: AddressValue | undefined,
      key: keyof AddressValue,
      newValue: string,
      onChange: (value: AddressValue) => void
    ) => {
      onChange({
        ...currentValue,
        [key]: newValue,
      });
    },
    []
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={cn(
                "rounded-lg border p-4 space-y-4",
                fieldState.error && "border-destructive"
              )}
            >
              <AddressContent
                field={field as unknown as ControllerRenderProps<FieldValues, string>}
                hasError={!!fieldState.error}
                disabled={disabled}
                showApartment={showApartment}
                showState={showState}
                countries={countries}
                states={states}
                layout={layout}
                labels={labels}
                placeholders={placeholders}
                updateField={updateField}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const FormAddressField = memo(
  FormAddressFieldComponent
) as typeof FormAddressFieldComponent;
