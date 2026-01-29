"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ChevronRight } from "lucide-react";
import type { PublicProductItem } from "../types/products.types";

interface ProductCardProps {
  product: PublicProductItem;
  locale: string;
  viewMoreLabel: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  locale,
  viewMoreLabel,
}: ProductCardProps) {
  const formattedPrice = useMemo(() => {
    if (product.price === null) return null;
    const formatter = new Intl.NumberFormat(locale === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: "MXN",
    });
    return formatter.format(product.price);
  }, [product.price, locale]);

  return (
    <Link
      href={`/${locale}/products/${product.categorySlug}/${product.slug}`}
      className="block h-full"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 group overflow-hidden">
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-background/80 backdrop-blur flex items-center justify-center ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          {formattedPrice && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur font-semibold">
                {formattedPrice}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="pt-4 pb-5">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.categoryName}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
              {product.description}
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
