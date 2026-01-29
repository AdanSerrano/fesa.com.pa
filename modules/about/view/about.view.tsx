import { getTranslations, getLocale } from "next-intl/server";
import { getAboutPageDataAction } from "../actions/about.actions";
import { AnimatedSection } from "@/components/ui/animated-section";
import { VideoPlayer } from "../components/video-player";
import Image from "next/image";
import {
  History,
  Target,
  Eye,
  Building2,
  Sparkles,
} from "lucide-react";
import type { AboutSection } from "../types/about.types";

const SectionCard = ({
  section,
  icon: Icon,
  iconColor,
  labels,
  delay,
}: {
  section: AboutSection;
  icon: React.ElementType;
  iconColor: string;
  labels: { noContent: string };
  delay: number;
}) => {
  const isVideo = section.mediaType === "video";

  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-lg">
        {section.mediaUrl && (
          <div className="relative overflow-hidden bg-muted">
            {isVideo ? (
              <VideoPlayer src={section.mediaUrl} title={section.title || undefined} />
            ) : (
              <div className="relative aspect-video">
                <Image
                  src={section.mediaUrl}
                  alt={section.title || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            )}
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-12 w-12 rounded-xl ${iconColor} flex items-center justify-center`}>
              <Icon className="h-6 w-6" />
            </div>
            {section.title && (
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {section.title}
              </h2>
            )}
          </div>
          {section.content ? (
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          ) : (
            <p className="text-muted-foreground">{labels.noContent}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export async function AboutView() {
  const locale = await getLocale();
  const t = await getTranslations("PublicAbout");
  const data = await getAboutPageDataAction();

  const hasContent = data.history || data.mission || data.vision;

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 h-[30vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl opacity-50" />

        <div className="container mx-auto px-4 py-12 sm:py-16 relative">
          <AnimatedSection animation="fade-down" delay={0}>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                {t("badge")}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                {t("title")}
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                {t("subtitle")}
              </p>
            </div>
          </AnimatedSection>

          {hasContent ? (
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              {data.history && (
                <SectionCard
                  section={data.history}
                  icon={History}
                  iconColor="bg-blue-500/10 text-blue-500"
                  labels={{ noContent: t("noContent") }}
                  delay={100}
                />
              )}

              {data.mission && (
                <SectionCard
                  section={data.mission}
                  icon={Target}
                  iconColor="bg-green-500/10 text-green-500"
                  labels={{ noContent: t("noContent") }}
                  delay={200}
                />
              )}

              {data.vision && (
                <SectionCard
                  section={data.vision}
                  icon={Eye}
                  iconColor="bg-purple-500/10 text-purple-500"
                  labels={{ noContent: t("noContent") }}
                  delay={300}
                />
              )}
            </div>
          ) : (
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="max-w-md mx-auto text-center py-16">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{t("noContentTitle")}</h2>
                <p className="text-muted-foreground">{t("noContentSubtitle")}</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
}
