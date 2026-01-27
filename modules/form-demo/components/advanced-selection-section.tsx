"use client";

import { memo, useMemo } from "react";
import type { Control } from "react-hook-form";
import {
  FormTreeSelectField,
  FormTransferField,
  FormMentionField,
  FormEmojiField,
} from "@/components/ui/form-fields";
import { Folder, File } from "lucide-react";

interface AdvancedSelectionSectionProps {
  control: Control<any>;
}

function AdvancedSelectionSectionComponent({ control }: AdvancedSelectionSectionProps) {
  const treeData = useMemo(
    () => [
      {
        value: "documents",
        label: "Documents",
        icon: Folder,
        children: [
          { value: "work", label: "Work", icon: Folder, children: [
            { value: "report.pdf", label: "Report.pdf", icon: File },
            { value: "presentation.pptx", label: "Presentation.pptx", icon: File },
          ]},
          { value: "personal", label: "Personal", icon: Folder, children: [
            { value: "resume.pdf", label: "Resume.pdf", icon: File },
          ]},
        ],
      },
      {
        value: "images",
        label: "Images",
        icon: Folder,
        children: [
          { value: "photo1.jpg", label: "Photo1.jpg", icon: File },
          { value: "photo2.jpg", label: "Photo2.jpg", icon: File },
        ],
      },
    ],
    []
  );

  const transferItems = useMemo(
    () => [
      { value: "item1", label: "Item 1", description: "First item" },
      { value: "item2", label: "Item 2", description: "Second item" },
      { value: "item3", label: "Item 3", description: "Third item" },
      { value: "item4", label: "Item 4", description: "Fourth item" },
      { value: "item5", label: "Item 5", description: "Fifth item" },
    ],
    []
  );

  const mentionUsers = useMemo(
    () => [
      { id: "1", name: "John Doe", username: "johndoe", avatar: "" },
      { id: "2", name: "Jane Smith", username: "janesmith", avatar: "" },
      { id: "3", name: "Bob Wilson", username: "bobwilson", avatar: "" },
      { id: "4", name: "Alice Brown", username: "alicebrown", avatar: "" },
    ],
    []
  );

  return (
    <div className="grid gap-6">
      <FormTreeSelectField
        control={control}
        name="treeSelectField"
        label="Tree Select Field"
        placeholder="Select items..."
        description="Hierarchical tree selection"
        options={treeData}
        multiple
        expandAll
      />

      <FormTransferField
        control={control}
        name="transferField"
        label="Transfer Field"
        description="Move items between lists"
        options={transferItems}
        showSearch
        labels={{
          available: "Available",
          selected: "Selected",
        }}
      />

      <FormMentionField
        control={control}
        name="mentionField"
        label="Mention Field"
        placeholder="Type @ to mention someone..."
        description="Text with @mentions support"
        users={mentionUsers}
        trigger="@"
      />

      <FormEmojiField
        control={control}
        name="emojiField"
        label="Emoji Field"
        placeholder="Add emojis..."
        description="Text with emoji picker"
        showSearch
        showPreview
      />
    </div>
  );
}

export const AdvancedSelectionSection = memo(AdvancedSelectionSectionComponent);
AdvancedSelectionSection.displayName = "AdvancedSelectionSection";
