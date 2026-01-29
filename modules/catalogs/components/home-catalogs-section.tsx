"use client";

import { memo, useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CatalogCard } from "./catalog-card";
import type { CatalogListItem } from "../types/catalogs.types";

interface Labels {
  title: string;
  description: string;
  badge: string;
  viewCatalogs: string;
  viewAll: string;
  modalTitle: string;
  selectCatalog: string;
  view: string;
  pages: string;
  year: string;
}

interface HomeCatalogsSectionProps {
  catalogs: CatalogListItem[];
  labels: Labels;
}

const CatalogsModal = memo(function CatalogsModal({
  open,
  onOpenChange,
  catalogs,
  labels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogs: CatalogListItem[];
  labels: Labels;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            {labels.modalTitle}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {labels.selectCatalog}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {catalogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No catalogs available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {catalogs.map((catalog) => (
                <CatalogCard
                  key={catalog.id}
                  catalog={catalog}
                  viewLabel={labels.view}
                  pagesLabel={labels.pages}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Link href="/catalogs">
            <Button variant="outline" className="group">
              {labels.viewAll}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
});

function HomeCatalogsSectionComponent({ catalogs, labels }: HomeCatalogsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((open: boolean) => {
    setModalOpen(open);
  }, []);

  if (catalogs.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 md:py-24 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <AnimatedSection animation="fade-up" delay={0}>
              <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
                      <div className="relative flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                        <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <Badge variant="secondary" className="mb-4">
                      <Sparkles className="mr-1 h-3 w-3" />
                      {labels.badge}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                      {labels.title}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl mb-6">
                      {labels.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        size="lg"
                        className="group w-full sm:w-auto"
                        onClick={handleOpenModal}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        {labels.viewCatalogs}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <Link href="/catalogs">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                          {labels.viewAll}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-col gap-2 items-end text-right">
                    <div className="text-4xl font-bold text-primary">{catalogs.length}</div>
                    <div className="text-sm text-muted-foreground">{labels.badge}</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CatalogsModal
        open={modalOpen}
        onOpenChange={handleCloseModal}
        catalogs={catalogs}
        labels={labels}
      />
    </>
  );
}

export const HomeCatalogsSection = memo(HomeCatalogsSectionComponent);
HomeCatalogsSection.displayName = "HomeCatalogsSection";
