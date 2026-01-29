"use client";

import { memo } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, ArrowRight } from "lucide-react";
import type { CatalogListItem } from "../types/catalogs.types";

interface CatalogCardProps {
  catalog: CatalogListItem;
  viewLabel: string;
  pagesLabel: string;
}

function CatalogCardComponent({ catalog, viewLabel, pagesLabel }: CatalogCardProps) {
  return (
    <Link href={`/catalogs/${catalog.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border-primary/10 hover:border-primary/30">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {catalog.coverImage ? (
            <>
              <Image
                src={catalog.coverImage}
                alt={catalog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-lg">
              {catalog.year}
            </Badge>
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
              <FileText className="h-3 w-3 mr-1" />
              {catalog.pageCount}
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="inline-flex items-center text-white text-sm font-medium">
              {viewLabel}
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {catalog.title}
          </h3>
          {catalog.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {catalog.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export const CatalogCard = memo(CatalogCardComponent);
CatalogCard.displayName = "CatalogCard";
