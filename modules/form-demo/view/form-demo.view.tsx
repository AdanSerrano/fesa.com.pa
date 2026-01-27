"use client";

import { memo, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FormSubmitButton, FormAlert } from "@/components/ui/form-fields";
import { toast } from "sonner";

import { BasicInputsSection } from "../components/basic-inputs-section";
import { SelectionSection } from "../components/selection-section";
import { DateTimeSection } from "../components/date-time-section";
import { SpecialInputsSection } from "../components/special-inputs-section";
import { ContentEditorsSection } from "../components/content-editors-section";
import { MultimediaSection } from "../components/multimedia-section";
import { LocationSection } from "../components/location-section";
import { FinancialSection } from "../components/financial-section";
import { NetworkSection } from "../components/network-section";
import { AdvancedTimeSection } from "../components/advanced-time-section";
import { AdvancedSelectionSection } from "../components/advanced-selection-section";
import { UtilitySection } from "../components/utility-section";

const formDemoSchema = z.object({
  textField: z.string().min(1, "Required"),
  passwordField: z.string().min(8, "Minimum 8 characters"),
  textareaField: z.string().optional(),
  numberField: z.number().optional(),

  selectField: z.string().optional(),
  comboboxField: z.string().optional(),
  multiSelectField: z.array(z.string()).optional(),
  radioGroupField: z.string().optional(),
  checkboxField: z.boolean().optional(),
  switchField: z.boolean().optional(),

  dateField: z.date().optional(),
  timeField: z.object({ hours: z.number(), minutes: z.number() }).optional(),
  otpField: z.string().optional(),
  sliderField: z.number().optional(),
  fileField: z.any().optional(),
  colorField: z.string().optional(),

  toggleGroupField: z.array(z.string()).optional(),
  tagField: z.array(z.string()).optional(),
  phoneField: z.string().optional(),
  currencyField: z.number().optional(),
  ratingField: z.number().optional(),
  autocompleteField: z.string().optional(),

  richTextField: z.string().optional(),
  markdownField: z.string().optional(),
  codeField: z.string().optional(),
  jsonField: z.any().optional(),

  imageCropField: z.string().optional(),
  avatarField: z.string().optional(),
  signatureField: z.string().optional(),

  addressField: z.any().optional(),
  coordinatesField: z.any().optional(),

  creditCardField: z.any().optional(),
  ibanField: z.string().optional(),
  percentageField: z.number().optional(),

  urlField: z.string().optional(),
  socialField: z.any().optional(),
  ipAddressField: z.string().optional(),

  durationField: z.any().optional(),
  scheduleField: z.any().optional(),
  recurrenceField: z.any().optional(),

  treeSelectField: z.array(z.string()).optional(),
  transferField: z.array(z.string()).optional(),
  mentionField: z.string().optional(),
  emojiField: z.string().optional(),

  maskField: z.string().optional(),
  arrayField: z.array(z.any()).optional(),
  confirmField: z.string().optional(),
});

type FormDemoValues = z.infer<typeof formDemoSchema>;

const ACCORDION_SECTIONS = [
  { value: "basic", label: "Basic Inputs", component: BasicInputsSection },
  { value: "selection", label: "Selection Controls", component: SelectionSection },
  { value: "datetime", label: "Date & Time", component: DateTimeSection },
  { value: "special", label: "Special Inputs", component: SpecialInputsSection },
  { value: "editors", label: "Content Editors", component: ContentEditorsSection },
  { value: "multimedia", label: "Multimedia", component: MultimediaSection },
  { value: "location", label: "Location & Address", component: LocationSection },
  { value: "financial", label: "Financial", component: FinancialSection },
  { value: "network", label: "URLs & Networks", component: NetworkSection },
  { value: "advancedTime", label: "Advanced Time", component: AdvancedTimeSection },
  { value: "advancedSelection", label: "Advanced Selection", component: AdvancedSelectionSection },
  { value: "utility", label: "Utilities", component: UtilitySection },
];

function FormDemoViewComponent() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormDemoValues>({
    resolver: zodResolver(formDemoSchema),
    defaultValues: {
      textField: "",
      passwordField: "",
      textareaField: "",
      numberField: 0,
      selectField: "",
      comboboxField: "",
      multiSelectField: [],
      radioGroupField: "",
      checkboxField: false,
      switchField: false,
      sliderField: 50,
      toggleGroupField: [],
      tagField: [],
      ratingField: 0,
      percentageField: 50,
      treeSelectField: [],
      transferField: [],
      arrayField: [],
    },
  });

  const handleSubmit = useCallback(
    (data: FormDemoValues) => {
      startTransition(() => {
        console.log("Form submitted:", data);
        toast.success("Form submitted successfully!");
      });
    },
    []
  );

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormAlert
              variant="info"
              title="Form Components Demo"
              message="This page demonstrates all available form field components. Expand each section to see the components."
            />

            <Accordion type="multiple" defaultValue={["basic"]} className="w-full">
              {ACCORDION_SECTIONS.map(({ value, label, component: SectionComponent }) => (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger className="text-lg font-medium">
                    {label}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <SectionComponent control={form.control} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <FormSubmitButton
              isPending={isPending}
              text="Submit Demo Form"
              loadingText="Submitting..."
              fullWidth
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const FormDemoView = memo(FormDemoViewComponent);
FormDemoView.displayName = "FormDemoView";
