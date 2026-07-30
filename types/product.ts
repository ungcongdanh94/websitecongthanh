export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  unit: string | null;
  specs: Record<string, unknown> | null;
  categoryName: string;
  brandName: string | null;
};
