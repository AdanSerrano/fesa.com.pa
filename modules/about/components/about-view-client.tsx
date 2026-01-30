"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { VideoPlayer } from "./video-player";
import {
  History,
  Target,
  Eye,
  Building2,
  Sparkles,
  Home,
  Award,
  Lightbulb,
  Heart,
  Shield,
  ArrowRight,
} from "lucide-react";
import type { AboutSection, AboutPageData } from "../types/about.types";

interface AboutViewClientProps {
  data: AboutPageData;
  locale: string;
  labels: {
    badge: string;
    title: string;
    subtitle: string;
    noContent: string;
    noContentTitle: string;
    noContentSubtitle: string;
    historyTitle: string;
    missionTitle: string;
    visionTitle: string;
    valuesTitle: string;
    valuesSubtitle: string;
    value1Title: string;
    value1Description: string;
    value2Title: string;
    value2Description: string;
    value3Title: string;
    value3Description: string;
    value4Title: string;
    value4Description: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    breadcrumbHome: string;
  };
}

const SectionMedia = memo(function SectionMedia({
  section,
}: {
  section: AboutSection;
}) {
  if (!section.mediaUrl) return null;

  const isVideo = section.mediaType === "video";

  if (isVideo) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <VideoPlayer src={section.mediaUrl} title={section.title || undefined} />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
      <Image
        src={section.mediaUrl}
        alt={section.title || ""}
        fill
        className="object-cover transition-transform duration-500 hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
    </div>
  );
});
SectionMedia.displayName = "SectionMedia";

const HistorySection = memo(function HistorySection({
  section,
  title,
  noContent,
}: {
  section: AboutSection;
  title: string;
  noContent: string;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100}>
      <div className="relative overflow-hidden rounded-2xl border bg-card/95 backdrop-blur-sm shadow-lg p-6 sm:p-8">
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-sky-500 via-sky-400 to-sky-300 dark:from-sky-400 dark:via-sky-500 dark:to-sky-600" />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-500/10 dark:bg-sky-400/10 blur-2xl" />

        <div className="flex flex-col md:flex-row gap-6 items-start relative">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 rounded-xl bg-sky-500 dark:bg-sky-600 shadow-lg shadow-sky-500/25 dark:shadow-sky-600/25 flex items-center justify-center">
              <History className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <Badge className="mb-3 bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 dark:hover:bg-sky-500">
                {title}
              </Badge>
              {section.title && (
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                  {section.title}
                </h2>
              )}
            </div>

            {section.mediaUrl && <SectionMedia section={section} />}

            {section.content ? (
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            ) : (
              <p className="text-muted-foreground">{noContent}</p>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
});
HistorySection.displayName = "HistorySection";

const MissionVisionCard = memo(function MissionVisionCard({
  section,
  title,
  icon: Icon,
  iconColor,
  borderColor,
  noContent,
  delay,
}: {
  section: AboutSection;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  borderColor: string;
  noContent: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className={`relative h-full overflow-hidden rounded-2xl border-2 ${borderColor} bg-card p-6 sm:p-8`}>
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl" />

        <div className="relative space-y-4">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl ${iconColor} flex items-center justify-center`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                {title}
              </Badge>
              {section.title && (
                <h3 className="text-xl font-bold">{section.title}</h3>
              )}
            </div>
          </div>

          {section.mediaUrl && (
            <div className="pt-2">
              <SectionMedia section={section} />
            </div>
          )}

          {section.content ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          ) : (
            <p className="text-muted-foreground">{noContent}</p>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
});
MissionVisionCard.displayName = "MissionVisionCard";

const ValueCard = memo(function ValueCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={delay}>
      <div className="group relative h-full overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
        <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative space-y-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
});
ValueCard.displayName = "ValueCard";

function AboutViewClientComponent({ data, locale, labels }: AboutViewClientProps) {
  const hasContent = data.history || data.mission || data.vision;

  const values = [
    { icon: Award, title: labels.value1Title, description: labels.value1Description },
    { icon: Lightbulb, title: labels.value2Title, description: labels.value2Description },
    { icon: Heart, title: labels.value3Title, description: labels.value3Description },
    { icon: Shield, title: labels.value4Title, description: labels.value4Description },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 h-[40vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-2xl opacity-50" />

        <div className="container mx-auto px-4 py-6 sm:py-10 relative">
          <AnimatedSection animation="fade-down" delay={0}>
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/${locale}`} className="flex items-center gap-1.5">
                      <Home className="h-3.5 w-3.5" />
                      {labels.breadcrumbHome}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{labels.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </AnimatedSection>

          <AnimatedSection animation="fade-down" delay={50}>
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                {labels.badge}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                {labels.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                {labels.subtitle}
              </p>
            </div>
          </AnimatedSection>

          {hasContent ? (
            <div className="space-y-16 sm:space-y-24">
              {data.history && (
                <div className="max-w-4xl mx-auto">
                  <HistorySection
                    section={data.history}
                    title={labels.historyTitle}
                    noContent={labels.noContent}
                  />
                </div>
              )}

              {(data.mission || data.vision) && (
                <div className="max-w-5xl mx-auto">
                  <div className="grid gap-8 md:grid-cols-2">
                    {data.mission && (
                      <MissionVisionCard
                        section={data.mission}
                        title={labels.missionTitle}
                        icon={Target}
                        iconColor="bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                        borderColor="border-emerald-500/20 dark:border-emerald-400/20"
                        noContent={labels.noContent}
                        delay={200}
                      />
                    )}
                    {data.vision && (
                      <MissionVisionCard
                        section={data.vision}
                        title={labels.visionTitle}
                        icon={Eye}
                        iconColor="bg-violet-500/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400"
                        borderColor="border-violet-500/20 dark:border-violet-400/20"
                        noContent={labels.noContent}
                        delay={250}
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="max-w-5xl mx-auto">
                <AnimatedSection animation="fade-up" delay={300}>
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-3">
                      {labels.valuesTitle}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      {labels.valuesSubtitle}
                    </p>
                  </div>
                </AnimatedSection>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {values.map((value, index) => (
                    <ValueCard
                      key={value.title}
                      icon={value.icon}
                      title={value.title}
                      description={value.description}
                      delay={350 + index * 30}
                    />
                  ))}
                </div>
              </div>

              <AnimatedSection animation="fade-up" delay={500}>
                <div className="max-w-4xl mx-auto">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border p-8 sm:p-12 text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-primary/20 blur-3xl" />

                    <div className="relative space-y-4">
                      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {labels.ctaTitle}
                      </h2>
                      <p className="text-muted-foreground max-w-xl mx-auto">
                        {labels.ctaSubtitle}
                      </p>
                      <div className="pt-4">
                        <Button size="lg" asChild>
                          <Link href={`/${locale}/contact`}>
                            {labels.ctaButton}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          ) : (
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="max-w-md mx-auto text-center py-16">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{labels.noContentTitle}</h2>
                <p className="text-muted-foreground">{labels.noContentSubtitle}</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  );
}

export const AboutViewClient = memo(AboutViewClientComponent);
AboutViewClient.displayName = "AboutViewClient";
