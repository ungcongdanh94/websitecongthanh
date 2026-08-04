import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://congthanhco.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects, brands] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true }
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    })
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/gioi-thieu`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/san-pham`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/thuong-hieu`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/du-an`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/bang-gia`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/phan-mem`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/so-sanh`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/lien-he`, changeFrequency: "monthly", priority: 0.6 }
  ];

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/thuong-hieu/${brand.slug}`,
    lastModified: brand.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/du-an/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticRoutes, ...productRoutes, ...projectRoutes, ...brandRoutes];
}
