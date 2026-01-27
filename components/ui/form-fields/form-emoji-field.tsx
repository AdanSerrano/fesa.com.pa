"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, Search, Clock, Star, Coffee, Heart, Leaf, Flag, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BaseFormFieldProps } from "./form-field.types";

interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "recent",
    name: "Recent",
    icon: Clock,
    emojis: [],
  },
  {
    id: "smileys",
    name: "Smileys",
    icon: Smile,
    emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐"],
  },
  {
    id: "love",
    name: "Love",
    icon: Heart,
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "😍", "🥰", "😘", "😻", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "💏", "💋", "🌹", "🌷", "🌸"],
  },
  {
    id: "nature",
    name: "Nature",
    icon: Leaf,
    emojis: ["🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇"],
  },
  {
    id: "food",
    name: "Food",
    icon: Coffee,
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥖", "🍞", "🥨", "🥯", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗"],
  },
  {
    id: "activities",
    name: "Activities",
    icon: Star,
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚴", "🚵", "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼"],
  },
  {
    id: "travel",
    name: "Travel",
    icon: Flag,
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛹", "🛼", "🚁", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚀", "🛸", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚃", "⛵", "🛥️", "🚤", "🛳️", "⛴️", "🚢", "⚓", "🪝", "⛽", "🚧"],
  },
  {
    id: "symbols",
    name: "Symbols",
    icon: Hash,
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️", "📴", "📳", "🈶", "🈚"],
  },
];

export interface FormEmojiFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  multiple?: boolean;
  maxEmojis?: number;
  showSearch?: boolean;
  showPreview?: boolean;
  recentEmojis?: string[];
  onRecentChange?: (emojis: string[]) => void;
}

const EmojiGrid = memo(function EmojiGrid({
  emojis,
  onSelect,
}: {
  emojis: string[];
  onSelect: (emoji: string) => void;
}) {
  return (
    <div className="grid grid-cols-8 gap-1 p-2">
      {emojis.map((emoji, index) => (
        <button
          key={`${emoji}-${index}`}
          type="button"
          className="h-8 w-8 flex items-center justify-center text-xl hover:bg-accent rounded transition-colors"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
});

function FormEmojiFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select emoji...",
  disabled,
  className,
  required,
  multiple = false,
  maxEmojis = 10,
  showSearch = true,
  showPreview = true,
  recentEmojis = [],
  onRecentChange,
}: FormEmojiFieldProps<TFieldValues, TName>) {
  const searchRef = useRef("");

  const categoriesWithRecent = useMemo(() => {
    const cats = [...EMOJI_CATEGORIES];
    cats[0] = { ...cats[0], emojis: recentEmojis };
    return cats;
  }, [recentEmojis]);

  const addToRecent = useCallback(
    (emoji: string) => {
      if (!onRecentChange) return;
      const newRecent = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 20);
      onRecentChange(newRecent);
    },
    [recentEmojis, onRecentChange]
  );

  const searchEmojis = useCallback(
    (query: string): string[] => {
      if (!query) return [];
      const q = query.toLowerCase();
      const results: string[] = [];

      EMOJI_CATEGORIES.forEach((cat) => {
        if (cat.name.toLowerCase().includes(q)) {
          results.push(...cat.emojis.slice(0, 10));
        }
      });

      return results.slice(0, 50);
    },
    []
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedEmojis: string[] = multiple
          ? Array.isArray(field.value)
            ? field.value
            : []
          : field.value
          ? [field.value]
          : [];

        const handleSelect = (emoji: string) => {
          addToRecent(emoji);

          if (multiple) {
            const isSelected = selectedEmojis.includes(emoji);
            if (isSelected) {
              field.onChange(selectedEmojis.filter((e) => e !== emoji));
            } else if (selectedEmojis.length < maxEmojis) {
              field.onChange([...selectedEmojis, emoji]);
            }
          } else {
            field.onChange(emoji);
          }
        };

        const handleRemove = (emoji: string) => {
          if (multiple) {
            field.onChange(selectedEmojis.filter((e) => e !== emoji));
          } else {
            field.onChange("");
          }
        };

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "w-full justify-start font-normal",
                        fieldState.error && "border-destructive"
                      )}
                    >
                      <Smile className="h-4 w-4 mr-2 text-foreground/60" />
                      {selectedEmojis.length > 0 ? (
                        <span className="text-lg">{selectedEmojis.join(" ")}</span>
                      ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    {showSearch && (
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60 z-10 pointer-events-none" />
                          <Input
                            placeholder="Search emojis..."
                            className="h-8 pl-8"
                            onChange={(e) => {
                              searchRef.current = e.target.value;
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {searchRef.current ? (
                      <ScrollArea className="h-[250px]">
                        <EmojiGrid
                          emojis={searchEmojis(searchRef.current)}
                          onSelect={handleSelect}
                        />
                      </ScrollArea>
                    ) : (
                      <Tabs defaultValue={recentEmojis.length > 0 ? "recent" : "smileys"}>
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                          {categoriesWithRecent.map((cat) => {
                            if (cat.id === "recent" && cat.emojis.length === 0) return null;
                            const Icon = cat.icon;
                            return (
                              <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 py-2"
                              >
                                <Icon className="h-4 w-4" />
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                        {categoriesWithRecent.map((cat) => {
                          if (cat.id === "recent" && cat.emojis.length === 0) return null;
                          return (
                            <TabsContent key={cat.id} value={cat.id} className="mt-0">
                              <ScrollArea className="h-[200px]">
                                <EmojiGrid emojis={cat.emojis} onSelect={handleSelect} />
                              </ScrollArea>
                            </TabsContent>
                          );
                        })}
                      </Tabs>
                    )}
                  </PopoverContent>
                </Popover>

                {showPreview && selectedEmojis.length > 0 && multiple && (
                  <div className="flex flex-wrap gap-1">
                    {selectedEmojis.map((emoji, index) => (
                      <button
                        key={`${emoji}-${index}`}
                        type="button"
                        className="h-8 w-8 text-lg flex items-center justify-center border rounded hover:bg-destructive/10 hover:border-destructive transition-colors"
                        onClick={() => handleRemove(emoji)}
                        title="Remove"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
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

export const FormEmojiField = memo(
  FormEmojiFieldComponent
) as typeof FormEmojiFieldComponent;
