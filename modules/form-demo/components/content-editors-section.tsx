"use client";

import { memo } from "react";
import type { Control } from "react-hook-form";
import {
  FormRichTextField,
  FormMarkdownField,
  FormCodeField,
  FormJsonField,
} from "@/components/ui/form-fields";

interface ContentEditorsSectionProps {
  control: Control<any>;
}

function ContentEditorsSectionComponent({ control }: ContentEditorsSectionProps) {
  return (
    <div className="grid gap-6">
      <FormRichTextField
        control={control}
        name="richTextField"
        label="Rich Text Field"
        placeholder="Write formatted content..."
        description="WYSIWYG editor with formatting toolbar"
        minHeight={150}
      />

      <FormMarkdownField
        control={control}
        name="markdownField"
        label="Markdown Field"
        placeholder="Write markdown content..."
        description="Markdown editor with preview"
        minHeight={150}
        showPreview
        showToolbar
      />

      <FormCodeField
        control={control}
        name="codeField"
        label="Code Field"
        placeholder="// Write code here..."
        description="Code editor with syntax highlighting"
        language="typescript"
        showLineNumbers
        minHeight={150}
      />

      <FormJsonField
        control={control}
        name="jsonField"
        label="JSON Field"
        placeholder='{ "key": "value" }'
        description="JSON editor with validation"
        minHeight={150}
        showToolbar
        allowFormat
        allowMinify
      />
    </div>
  );
}

export const ContentEditorsSection = memo(ContentEditorsSectionComponent);
ContentEditorsSection.displayName = "ContentEditorsSection";
