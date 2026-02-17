"use client";

import { memo, useCallback, useReducer, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedSection } from "@/components/ui/animated-section";
import { toast } from "sonner";
import {
  History,
  Target,
  Eye,
  Save,
  Loader2,
  Image as ImageIcon,
  Video,
  X,
  Building2,
} from "lucide-react";
import Image from "next/image";
import {
  updateAboutSectionAction,
  getAboutMediaUploadUrlAction,
} from "../actions/admin-about.actions";
import { AdminVideoPlayer } from "../components/admin-video-player";
import type { AboutSection } from "../types/admin-about.types";

interface Labels {
  title: string;
  description: string;
  tabs: {
    history: string;
    mission: string;
    vision: string;
  };
  form: {
    title: string;
    titlePlaceholder: string;
    content: string;
    contentPlaceholder: string;
    mediaType: string;
    selectMediaType: string;
    image: string;
    video: string;
    noMedia: string;
    mediaUrl: string;
    mediaUrlPlaceholder: string;
    isActive: string;
    save: string;
    saving: string;
    uploadMedia: string;
    removeMedia: string;
  };
  messages: {
    saved: string;
    error: string;
  };
}

interface AdminAboutClientProps {
  initialSections: AboutSection[];
  labels: Labels;
}

interface SectionFormProps {
  section: AboutSection | null;
  sectionKey: string;
  icon: React.ElementType;
  iconColor: string;
  labels: Labels;
  onSave: () => void;
}

interface SectionFormState {
  title: string;
  content: string;
  mediaType: string;
  mediaUrl: string;
  isActive: boolean;
  pendingFile: File | null;
}

type SectionFormAction =
  | { type: "SET_TITLE"; value: string }
  | { type: "SET_CONTENT"; value: string }
  | { type: "SET_MEDIA_TYPE"; value: string }
  | { type: "SET_PENDING_FILE"; file: File; mediaType: string }
  | { type: "REMOVE_MEDIA" }
  | { type: "SET_IS_ACTIVE"; value: boolean }
  | { type: "SAVE_SUCCESS"; mediaUrl: string };

function sectionFormReducer(state: SectionFormState, action: SectionFormAction): SectionFormState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.value };
    case "SET_CONTENT":
      return { ...state, content: action.value };
    case "SET_MEDIA_TYPE":
      return { ...state, mediaType: action.value };
    case "SET_PENDING_FILE":
      return { ...state, pendingFile: action.file, mediaType: action.mediaType };
    case "REMOVE_MEDIA":
      return { ...state, pendingFile: null, mediaUrl: "", mediaType: "" };
    case "SET_IS_ACTIVE":
      return { ...state, isActive: action.value };
    case "SAVE_SUCCESS":
      return { ...state, pendingFile: null, mediaUrl: action.mediaUrl };
  }
}

const SectionForm = memo(function SectionForm({
  section,
  sectionKey,
  icon: Icon,
  iconColor,
  labels,
  onSave,
}: SectionFormProps) {
  const [formState, dispatch] = useReducer(sectionFormReducer, {
    title: section?.title || "",
    content: section?.content || "",
    mediaType: section?.mediaType || "",
    mediaUrl: section?.mediaUrl || "",
    isActive: section?.isActive ?? true,
    pendingFile: null,
  });
  const [isPending, startTransition] = useTransition();

  const previewUrl = useMemo(() => {
    if (formState.pendingFile) {
      return URL.createObjectURL(formState.pendingFile);
    }
    return formState.mediaUrl;
  }, [formState.pendingFile, formState.mediaUrl]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      let detectedType = "";
      if (file.type.startsWith("video/")) {
        detectedType = "video";
      } else if (file.type.startsWith("image/")) {
        detectedType = "image";
      }
      dispatch({ type: "SET_PENDING_FILE", file, mediaType: detectedType || formState.mediaType });
    }
  }, [formState.mediaType]);

  const handleRemoveMedia = useCallback(() => {
    dispatch({ type: "REMOVE_MEDIA" });
  }, []);

  const handleSave = useCallback(() => {
    startTransition(async () => {
      try {
        let finalMediaUrl = formState.mediaUrl;

        if (formState.pendingFile) {
          const uploadResult = await getAboutMediaUploadUrlAction(
            sectionKey,
            formState.pendingFile.name,
            formState.pendingFile.type
          );

          if ("error" in uploadResult) {
            toast.error(uploadResult.error);
            return;
          }

          const response = await fetch(uploadResult.url, {
            method: "PUT",
            headers: { "Content-Type": formState.pendingFile.type },
            body: formState.pendingFile,
          });

          if (response.ok) {
            finalMediaUrl = uploadResult.publicUrl;
          } else {
            toast.error(labels.messages.error);
            return;
          }
        }

        const result = await updateAboutSectionAction({
          section: sectionKey,
          title: formState.title || null,
          content: formState.content || null,
          mediaType: formState.mediaType || null,
          mediaUrl: finalMediaUrl || null,
          isActive: formState.isActive,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(labels.messages.saved);
          dispatch({ type: "SAVE_SUCCESS", mediaUrl: finalMediaUrl });
          onSave();
        }
      } catch {
        toast.error(labels.messages.error);
      }
    });
  }, [sectionKey, formState, labels, onSave]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${iconColor} flex items-center justify-center`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{labels.tabs[sectionKey as keyof typeof labels.tabs]}</CardTitle>
            <CardDescription>
              {section ? (
                <Badge variant={section.isActive ? "default" : "secondary"} className="mt-1">
                  {section.isActive ? "Activo" : "Inactivo"}
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-1">Sin contenido</Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${sectionKey}-title`}>{labels.form.title}</Label>
          <Input
            id={`${sectionKey}-title`}
            value={formState.title}
            onChange={(e) => dispatch({ type: "SET_TITLE", value: e.target.value })}
            placeholder={labels.form.titlePlaceholder}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${sectionKey}-content`}>{labels.form.content}</Label>
          <Textarea
            id={`${sectionKey}-content`}
            value={formState.content}
            onChange={(e) => dispatch({ type: "SET_CONTENT", value: e.target.value })}
            placeholder={labels.form.contentPlaceholder}
            rows={6}
            disabled={isPending}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{labels.form.mediaType}</Label>
            <Select
              value={formState.mediaType || "none"}
              onValueChange={(v) => dispatch({ type: "SET_MEDIA_TYPE", value: v === "none" ? "" : v })}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder={labels.form.selectMediaType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{labels.form.noMedia}</SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {labels.form.image}
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {labels.form.video}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formState.mediaType && (
            <div className="space-y-3">
              {previewUrl ? (
                <div className="relative">
                  <div className="relative w-full overflow-hidden rounded-lg border bg-muted">
                    {formState.mediaType === "video" ? (
                      <AdminVideoPlayer src={previewUrl} isPending={!!formState.pendingFile} />
                    ) : (
                      <div className="relative aspect-video">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="400px"
                          unoptimized={!!formState.pendingFile}
                        />
                        {formState.pendingFile && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Pendiente
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveMedia}
                    disabled={isPending}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {labels.form.removeMedia}
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept={formState.mediaType === "video" ? "video/*" : "image/*"}
                    onChange={handleFileSelect}
                    disabled={isPending}
                    className="hidden"
                    id={`${sectionKey}-media-upload`}
                  />
                  <label
                    htmlFor={`${sectionKey}-media-upload`}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {formState.mediaType === "video" ? (
                        <Video className="h-10 w-10 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {labels.form.uploadMedia}
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id={`${sectionKey}-active`}
            checked={formState.isActive}
            onCheckedChange={(checked) => dispatch({ type: "SET_IS_ACTIVE", value: checked })}
            disabled={isPending}
          />
          <Label htmlFor={`${sectionKey}-active`}>{labels.form.isActive}</Label>
        </div>

        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {labels.form.saving}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {labels.form.save}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

export const AdminAboutClient = memo(function AdminAboutClient({
  initialSections,
  labels,
}: AdminAboutClientProps) {
  const router = useRouter();

  const sectionsMap = useMemo(() => {
    const map: Record<string, AboutSection | null> = {
      history: null,
      mission: null,
      vision: null,
    };
    for (const section of initialSections) {
      map[section.section] = section;
    }
    return map;
  }, [initialSections]);

  const handleSave = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="space-y-6">
      <AnimatedSection animation="fade-down" delay={0}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{labels.title}</h1>
              <p className="text-muted-foreground">{labels.description}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={100}>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.tabs.history}</span>
            </TabsTrigger>
            <TabsTrigger value="mission" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.tabs.mission}</span>
            </TabsTrigger>
            <TabsTrigger value="vision" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">{labels.tabs.vision}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <SectionForm
              section={sectionsMap.history}
              sectionKey="history"
              icon={History}
              iconColor="bg-blue-500/10 text-blue-500"
              labels={labels}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="mission" className="mt-6">
            <SectionForm
              section={sectionsMap.mission}
              sectionKey="mission"
              icon={Target}
              iconColor="bg-green-500/10 text-green-500"
              labels={labels}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="vision" className="mt-6">
            <SectionForm
              section={sectionsMap.vision}
              sectionKey="vision"
              icon={Eye}
              iconColor="bg-purple-500/10 text-purple-500"
              labels={labels}
              onSave={handleSave}
            />
          </TabsContent>
        </Tabs>
      </AnimatedSection>
    </div>
  );
});
