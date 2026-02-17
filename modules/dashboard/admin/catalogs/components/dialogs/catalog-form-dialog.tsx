"use client";

import { memo, useCallback, useMemo, useRef, useTransition, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { createCatalogSchema } from "../../validations/schema/admin-catalogs.schema";
import {
  createCatalogAction,
  updateCatalogAction,
  getCatalogUploadUrlAction,
} from "../../actions/admin-catalogs.actions";
import type { AdminCatalog, PageInput } from "../../types/admin-catalogs.types";

interface PageItemData {
  id?: string;
  tempId: string;
  imageUrl: string;
  alt: string | null;
  order: number;
  isNew?: boolean;
  fileName?: string;
}

interface Labels {
  createTitle: string;
  editTitle: string;
  title: string;
  titlePlaceholder: string;
  year: string;
  yearPlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  coverImage: string;
  pages: string;
  addPage: string;
  dragToReorder: string;
  isActive: string;
  isFeatured: string;
  save: string;
  saving: string;
  cancel: string;
  uploadCover: string;
  removeCover: string;
  page: string;
}

interface CatalogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: AdminCatalog | null;
  labels: Labels;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  year: number;
  slug?: string;
  description?: string | null;
  coverImage?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  pages?: {
    id?: string;
    tempId?: string;
    imageUrl: string;
    alt?: string | null;
    order: number;
    isNew?: boolean;
    fileName?: string;
  }[];
}

interface SortablePageItemProps {
  page: PageItemData;
  index: number;
  onRemove: () => void;
  disabled: boolean;
  labels: Labels;
}

function SortablePageItem({ page, index, onRemove, disabled, labels }: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
    >
      <button
        type="button"
        className="touch-none cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="relative h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
        {page.imageUrl ? (
          <Image
            src={page.imageUrl}
            alt={page.alt || `${labels.page} ${index + 1}`}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized={page.imageUrl.startsWith("blob:")}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{labels.page} {index + 1}</p>
        {page.fileName && (
          <p className="text-xs text-muted-foreground truncate">{page.fileName}</p>
        )}
        {page.isNew && (
          <span className="text-xs text-primary">Pendiente</span>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

const SortablePageItemMemo = memo(SortablePageItem);

function CatalogFormDialogComponent({
  open,
  onOpenChange,
  catalog,
  labels,
  onSuccess,
}: CatalogFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!catalog;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const prevOpenRef = useRef(false);
  const prevCatalogIdRef = useRef<string | null>(null);
  const pendingFilesRef = useRef<Map<string, File>>(new Map());
  const coverFileRef = useRef<File | null>(null);
  const tempIdCounterRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateTempId = useCallback(() => {
    tempIdCounterRef.current += 1;
    return `temp-${Date.now()}-${tempIdCounterRef.current}`;
  }, []);

  const initialPages = useMemo<PageItemData[]>(() => {
    if (!catalog?.pages) return [];
    return catalog.pages.map((p) => ({
      id: p.id,
      tempId: p.id || generateTempId(),
      imageUrl: p.imageUrl,
      alt: p.alt,
      order: p.order,
    }));
  }, [catalog?.pages, generateTempId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(createCatalogSchema),
    defaultValues: {
      title: catalog?.title || "",
      year: catalog?.year || new Date().getFullYear(),
      description: catalog?.description || "",
      coverImage: catalog?.coverImage || "",
      isActive: catalog?.isActive ?? false,
      isFeatured: catalog?.isFeatured ?? false,
      pages: initialPages,
    },
  });

  const pages = (form.watch("pages") || []) as PageItemData[];
  const coverImage = form.watch("coverImage");

  const pageIds = useMemo(() => pages.map((p) => p.tempId), [pages]);

  useLayoutEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    const catalogChanged = catalog?.id !== prevCatalogIdRef.current;

    if (justOpened || catalogChanged) {
      tempIdCounterRef.current = 0;
      form.reset({
        title: catalog?.title || "",
        year: catalog?.year || new Date().getFullYear(),
        description: catalog?.description || "",
        coverImage: catalog?.coverImage || "",
        isActive: catalog?.isActive ?? false,
        isFeatured: catalog?.isFeatured ?? false,
        pages: initialPages,
      });
      pendingFilesRef.current.clear();
      coverFileRef.current = null;
    }

    prevOpenRef.current = open;
    prevCatalogIdRef.current = catalog?.id ?? null;
  }, [open, catalog, initialPages, form]);

  const handleCoverSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      form.setValue("coverImage", previewUrl);
      coverFileRef.current = file;
    }
  }, [form]);

  const handleRemoveCover = useCallback(() => {
    form.setValue("coverImage", "");
    coverFileRef.current = null;
  }, [form]);

  const handleAddPages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentPages = (form.getValues("pages") || []) as PageItemData[];

    const newPages: PageItemData[] = Array.from(files).map((file, idx) => {
      const tempId = generateTempId();
      pendingFilesRef.current.set(tempId, file);
      return {
        tempId,
        imageUrl: URL.createObjectURL(file),
        alt: null,
        order: currentPages.length + idx,
        isNew: true,
        fileName: file.name,
      };
    });

    form.setValue("pages", [...currentPages, ...newPages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [form, generateTempId]);

  const handleRemovePage = useCallback((tempId: string) => {
    const currentPages = (form.getValues("pages") || []) as PageItemData[];
    pendingFilesRef.current.delete(tempId);

    const updatedPages = currentPages
      .filter((p) => p.tempId !== tempId)
      .map((p, i) => ({ ...p, order: i }));
    form.setValue("pages", updatedPages);
  }, [form]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentPages = (form.getValues("pages") || []) as PageItemData[];
      const oldIndex = currentPages.findIndex((p) => p.tempId === active.id);
      const newIndex = currentPages.findIndex((p) => p.tempId === over.id);

      const reorderedPages = arrayMove(currentPages, oldIndex, newIndex).map((p, i) => ({
        ...p,
        order: i,
      }));

      form.setValue("pages", reorderedPages);
    }
  }, [form]);

  const onSubmit = useCallback((values: FormValues) => {
    startTransition(async () => {
      try {
        const catalogId = catalog?.id || `temp-${Date.now()}`;
        let finalCoverImage = values.coverImage;
        const coverFile = coverFileRef.current;

        if (coverFile && finalCoverImage?.startsWith("blob:")) {
          const uploadResult = await getCatalogUploadUrlAction(
            catalogId,
            coverFile.name,
            coverFile.type,
            "cover",
            values.year
          );

          if ("error" in uploadResult) {
            toast.error(`Error portada: ${uploadResult.error}`);
            return;
          }

          if (!uploadResult.publicUrl) {
            toast.error("Error: URL pública no configurada para portada");
            return;
          }

          const response = await fetch(uploadResult.url, {
            method: "PUT",
            headers: { "Content-Type": coverFile.type },
            body: coverFile,
          });

          if (!response.ok) {
            toast.error(`Error al subir portada: ${response.status} ${response.statusText}`);
            return;
          }

          finalCoverImage = uploadResult.publicUrl;
        }

        const finalPages: PageInput[] = [];
        const pagesData = (values.pages || []) as PageItemData[];

        for (let i = 0; i < pagesData.length; i++) {
          const page = pagesData[i];
          let imageUrl = page.imageUrl;
          const pendingFile = pendingFilesRef.current.get(page.tempId);

          if (pendingFile && page.imageUrl.startsWith("blob:")) {
            const uploadResult = await getCatalogUploadUrlAction(
              catalogId,
              pendingFile.name,
              pendingFile.type,
              "page",
              values.year,
              i
            );

            if ("error" in uploadResult) {
              toast.error(`Error página ${i + 1}: ${uploadResult.error}`);
              return;
            }

            if (!uploadResult.publicUrl) {
              toast.error(`Error: URL pública no configurada para página ${i + 1}`);
              return;
            }

            const response = await fetch(uploadResult.url, {
              method: "PUT",
              headers: { "Content-Type": pendingFile.type },
              body: pendingFile,
            });

            if (!response.ok) {
              toast.error(`Error al subir página ${i + 1}: ${response.status} ${response.statusText}`);
              return;
            }

            imageUrl = uploadResult.publicUrl;
          }

          if (!imageUrl || imageUrl.startsWith("blob:")) {
            toast.error(`Error: imagen no válida en página ${i + 1}`);
            return;
          }

          finalPages.push({
            imageUrl,
            alt: page.alt,
            order: i,
          });
        }

        const result = isEditing
          ? await updateCatalogAction({
              id: catalog.id,
              title: values.title,
              year: values.year,
              description: values.description || null,
              coverImage: finalCoverImage || null,
              isActive: values.isActive,
              isFeatured: values.isFeatured,
              pages: finalPages,
            })
          : await createCatalogAction({
              title: values.title,
              year: values.year,
              description: values.description || null,
              coverImage: finalCoverImage || null,
              isActive: values.isActive,
              isFeatured: values.isFeatured,
              pages: finalPages,
            });

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success);
          onOpenChange(false);
          onSuccess();
        }
      } catch {
        toast.error("Error al guardar el catálogo");
      }
    });
  }, [catalog, isEditing, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? labels.editTitle : labels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.title}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={labels.titlePlaceholder}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{labels.year}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder={labels.yearPlaceholder}
                        disabled={isPending}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.description}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder={labels.descriptionPlaceholder}
                      disabled={isPending}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>{labels.coverImage}</Label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
              {coverImage ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    fill
                    className="object-cover"
                    sizes="400px"
                    unoptimized={coverImage.startsWith("blob:")}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveCover}
                    disabled={isPending}
                    className="absolute top-2 right-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {labels.removeCover}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isPending}
                  className="w-full h-20"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {labels.uploadCover}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{labels.pages}</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddPages}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {labels.addPage}
                </Button>
              </div>

              {pages.length > 0 && (
                <p className="text-xs text-muted-foreground">{labels.dragToReorder}</p>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={pageIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {pages.map((page, index) => (
                      <SortablePageItemMemo
                        key={page.tempId}
                        page={page}
                        index={index}
                        onRemove={() => handleRemovePage(page.tempId)}
                        disabled={isPending}
                        labels={labels}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {pages.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {labels.addPage}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) => form.setValue("isActive", checked)}
                  disabled={isPending}
                />
                <Label htmlFor="isActive">{labels.isActive}</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isFeatured"
                  checked={form.watch("isFeatured")}
                  onCheckedChange={(checked) => form.setValue("isFeatured", checked)}
                  disabled={isPending}
                />
                <Label htmlFor="isFeatured">{labels.isFeatured}</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {labels.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {labels.saving}
                  </>
                ) : (
                  labels.save
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const CatalogFormDialog = memo(CatalogFormDialogComponent);
CatalogFormDialog.displayName = "CatalogFormDialog";
