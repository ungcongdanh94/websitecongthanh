import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "So sánh sản phẩm | CÔNG THẢNH",
  description: "So sánh nhanh các sản phẩm nhôm, phụ kiện và nội thất nhôm trước khi lựa chọn."
};

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const idList = Array.isArray(ids) ? ids : ids ? [ids] : [];
  const selectedIds = idList.filter(Boolean).slice(0, 4);

  const allProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  const selected = selectedIds.length
    ? selectedIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean)
    : allProducts.slice(0, 3);

  // Gộp tất cả tên thông số kỹ thuật (specs) xuất hiện ở bất kỳ sản phẩm nào đang so sánh
  const specKeys = Array.from(
    new Set(
      selected.flatMap((product) =>
        product && product!.specs && typeof product!.specs === "object" && !Array.isArray(product!.specs)
          ? Object.keys(product!.specs as Record<string, unknown>)
          : []
      )
    )
  );

  const rows: [string, string[]][] = [
    ["Thương hiệu", selected.map((p) => p?.brand?.name || "—")],
    ["Danh mục", selected.map((p) => p?.category.name || "—")],
    ["Hệ nhôm", selected.map((p) => p?.aluminumSystem || "—")],
    ["Màu sắc", selected.map((p) => p?.color || "—")],
    [
      "Giá tham khảo",
      selected.map((p) => (p?.price ? `${Number(p.price).toLocaleString("vi-VN")} đ/${p.unit || "sp"}` : "Liên hệ"))
    ],
    ...specKeys.map(
      (key): [string, string[]] => [
        key,
        selected.map((p) => {
          const specs = p?.specs && typeof p.specs === "object" && !Array.isArray(p.specs) ? (p.specs as Record<string, unknown>) : {};
          return specs[key] ? String(specs[key]) : "—";
        })
      ]
    )
  ];

  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">So sánh sản phẩm</div>
        <h1 className="section-title mt-3">So sánh nhanh trước khi lựa chọn</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Chọn tối đa 4 sản phẩm để so sánh trực tiếp thông số, giá và thương hiệu.
        </p>
      </div>

      <form method="get" action="/so-sanh" className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-3">
        {allProducts.map((product) => (
          <label key={product.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 text-sm hover:border-brand-300">
            <input
              type="checkbox"
              name="ids"
              value={product.id}
              defaultChecked={selected.some((p) => p?.id === product.id)}
              className="h-4 w-4 accent-brand-600"
            />
            <span className="font-semibold">{product.name}</span>
          </label>
        ))}
        <button className="btn-primary sm:col-span-2 xl:col-span-3">
          So sánh sản phẩm đã chọn
        </button>
      </form>

      {selected.length > 0 && (
        <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-brand-800 text-white">
                <th className="p-4">Tiêu chí</th>
                {selected.map((product) => (
                  <th key={product?.id} className="p-4">
                    <Link href={`/san-pham/${product?.slug}`} className="hover:underline">
                      {product?.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, values]) => (
                <tr key={label} className="border-t border-slate-100">
                  <td className="p-4 font-bold">{label}</td>
                  {values.map((value, index) => (
                    <td key={index} className="p-4">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
