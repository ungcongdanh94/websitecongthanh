export type RecentProduct = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  unit: string | null;
};

const STORAGE_KEY = "ct-recently-viewed";
const MAX_ITEMS = 8;

export function trackRecentlyViewed(product: RecentProduct) {
  if (typeof window === "undefined") return;
  try {
    const current: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const next = [product, ...current.filter((item) => item.id !== product.id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage có thể bị chặn (chế độ ẩn danh...) — bỏ qua, không ảnh hưởng chức năng chính
  }
}

export function getRecentlyViewed(excludeId?: string): RecentProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const current: RecentProduct[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return excludeId ? current.filter((item) => item.id !== excludeId) : current;
  } catch {
    return [];
  }
}
