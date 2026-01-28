import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getServiceDetailAction } from "../actions/services.actions";
import { AnimatedSection } from "@/components/ui/animated-section";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Layers,
  MessageSquare,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ServiceDetailViewProps {
  categorySlug: string;
  serviceSlug: string;
}

export async function ServiceDetailView({
  categorySlug,
  serviceSlug,
}: ServiceDetailViewProps) {
  const locale = await getLocale();
  const t = await getTranslations("PublicServices");

  const service = await getServiceDetailAction(categorySlug, serviceSlug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 h-[40vh] sm:h-[50vh] bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-primary/5 blur-2xl opacity-50" />

        <div className="container mx-auto px-4 py-6 sm:py-8 relative">
          <AnimatedSection animation="fade-down" delay={0}>
            <Link href={`/${locale}/services/${categorySlug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="mb-6 hover:bg-background/80 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToCategory")}
              </Button>
            </Link>
          </AnimatedSection>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            <AnimatedSection animation="fade-right" delay={100}>
              <div className="sticky top-24">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/10 ring-1 ring-border/50">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                      <div className="h-24 w-24 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20">
                        <Layers className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border-0 shadow-lg"
                  >
                    {service.categoryName}
                  </Badge>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={200}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-primary uppercase tracking-wider">
                      {service.categoryName}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {service.name}
                  </h1>
                </div>

                {service.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                )}

                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">{t("whyChooseUs")}</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{t("feature1")}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{t("feature2")}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{t("feature3")}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                    <Link href={`/${locale}/contact`}>
                      <MessageSquare className="h-5 w-5" />
                      {t("contactUs")}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2" asChild>
                    <Link href={`/${locale}/services`}>
                      {t("viewAllServices")}
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
