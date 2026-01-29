"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, ArrowRight, ChevronRight } from "lucide-react";
import type { PublicNewsCategory } from "../types/news.types";

interface CategoryCardProps {
  category: PublicNewsCategory;
  locale: string;
  viewMoreLabel: string;
}

export const CategoryCard = memo(function CategoryCard({
  category,
  locale,
  viewMoreLabel,
}: CategoryCardProps) {
  return (
    <Link href={`/${locale}/news/${category.slug}`} className="block h-full">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 group overflow-hidden">
        <div className="relative h-32 sm:h-36 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                {category.icon ? (
                  <span className="text-3xl">{category.icon}</span>
                ) : (
                  <FolderOpen className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <CardContent className="pt-4 pb-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-sm font-medium text-primary">
              {viewMoreLabel}
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <ChevronRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
