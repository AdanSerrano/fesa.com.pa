"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, ArrowRight } from "lucide-react";
import type { PublicServiceItem } from "../types/services.types";

interface ServiceCardProps {
  service: PublicServiceItem;
  locale: string;
  viewMoreLabel: string;
}

export const ServiceCard = memo(function ServiceCard({
  service,
  locale,
  viewMoreLabel,
}: ServiceCardProps) {
  return (
    <Link href={`/${locale}/services/${service.categorySlug}/${service.slug}`} className="block h-full">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 group overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {service.image ? (
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="h-16 w-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <Layers className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 text-xs bg-background/90 backdrop-blur-sm border-0 shadow-sm"
          >
            {service.categoryName}
          </Badge>
        </div>

        <CardContent className="pt-4 pb-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {service.name}
          </h3>
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
              {service.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="inline-flex items-center text-sm font-medium text-primary">
              {viewMoreLabel}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
