import type { MetadataRoute } from "next";
import { db } from "@/utils/db";
import { locales } from "@/i18n/routing";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { path: "", changeFrequency: "monthly" as const, priority: 1.0 },
    { path: "/products", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/news", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/catalogs", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/login", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/register", changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${APP_URL}/${locale}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  const [productCategories, serviceCategories, newsCategories, newsArticles, catalogs] =
    await Promise.all([
      db.productCategory.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      db.serviceCategory.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      db.newsCategory.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      db.news.findMany({
        where: { isActive: true, publishedAt: { not: null } },
        select: {
          slug: true,
          updatedAt: true,
          category: { select: { slug: true } },
        },
      }),
      db.catalog.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...productCategories.flatMap((cat) =>
      locales.map((locale) => ({
        url: `${APP_URL}/${locale}/products/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    ),
    ...serviceCategories.flatMap((cat) =>
      locales.map((locale) => ({
        url: `${APP_URL}/${locale}/services/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    ),
    ...newsCategories.flatMap((cat) =>
      locales.map((locale) => ({
        url: `${APP_URL}/${locale}/news/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      }))
    ),
    ...newsArticles.flatMap((article) =>
      locales.map((locale) => ({
        url: `${APP_URL}/${locale}/news/${article.category?.slug}/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    ),
    ...catalogs.flatMap((catalog) =>
      locales.map((locale) => ({
        url: `${APP_URL}/${locale}/catalogs/${catalog.slug}`,
        lastModified: catalog.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    ),
  ];

  return [...staticEntries, ...dynamicEntries];
}
