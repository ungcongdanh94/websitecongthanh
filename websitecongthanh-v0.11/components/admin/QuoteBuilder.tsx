"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Printer, Save, Trash2 } from "lucide-react";

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
  unit: string | null;
  price: number | null;
};

type QuoteLine = {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountRate: number;
  note: string;
};

type QuoteData = {
  id: string;
  quoteNumber: string;
  customerName: string;
  phone: string;
  email: string;
  company: string;
  address: string;
  note: string;
  terms: string;
  status: string;
  discountRate: number;
  taxRate: number;
  validUntil: string;
  items: QuoteLine[];
};

function money(value: number) {
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
}

export default function QuoteBuilder({
  initialQuote,
  products
}: {
  initialQuote: QuoteData;
  products: ProductOption[];
}) {
  const router = useRouter();
  const [quote, setQuote] = useState(initialQuote);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => {
    const subtotal = quote.items.reduce((sum, item) => {
      const gross = Math.max(0, item.quantity) * Math.max(0, item.unitPrice);
      return sum + gross * (1 - Math.min(100, Math.max(0, item.discountRate)) / 100);
    }, 0);
    const discountValue = subtotal * Math.min(100, Math.max(0, quote.discountRate)) / 100;
    const afterDiscount = subtotal - discountValue;
    const taxValue = afterDiscount * Math.min(100, Math.max(0, quote.taxRate)) / 100;
    return { subtotal, discountValue, taxValue, total: afterDiscount + taxValue };
  }, [quote]);

  function addLine() {
    setQuote((current) => ({
      ...current,
      items: [...current.items, {
        productId: "",
        productName: "",
        quantity: 1,
        unit: "bộ",
        unitPrice: 0,
        discountRate: 0,
        note: ""
      }]
    }));
  }

  function updateLine(index: number, patch: Partial<QuoteLine>) {
    setQuote((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)
    }));
  }

  function selectProduct(index: number, productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      updateLine(index, { productId: "" });
      return;
    }
    updateLine(index, {
      productId: product.id,
      productName: product.name,
      unit: product.unit || "bộ",
      unitPrice: product.price || 0
    });
  }

  function removeLine(index: number) {
    setQuote((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/admin/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.message || "Không thể lưu báo giá");
      return;
    }

    setMessage("Đã lưu báo giá.");
    router.refresh();
  }

  const field = "w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Mã báo giá</div>
            <div className="text-2xl font-black">{quote.quoteNumber}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => window.open(`/admin/quotes/${quote.id}/print`, "_blank")} className="btn-secondary">
              <Printer className="mr-2 h-4 w-4" /> In / PDF
            </button>
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              <Save className="mr-2 h-4 w-4" /> {saving ? "Đang lưu..." : "Lưu báo giá"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input className={field} value={quote.customerName} onChange={(e) => setQuote({ ...quote, customerName: e.target.value })} placeholder="Tên khách hàng" />
          <input className={field} value={quote.phone} onChange={(e) => setQuote({ ...quote, phone: e.target.value })} placeholder="Số điện thoại" />
          <input className={field} type="email" value={quote.email} onChange={(e) => setQuote({ ...quote, email: e.target.value })} placeholder="Email" />
          <input className={field} value={quote.company} onChange={(e) => setQuote({ ...quote, company: e.target.value })} placeholder="Công ty / xưởng" />
          <input className={field} value={quote.address} onChange={(e) => setQuote({ ...quote, address: e.target.value })} placeholder="Địa chỉ" />
          <input className={field} type="date" value={quote.validUntil} onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })} />
          <select className={field} value={quote.status} onChange={(e) => setQuote({ ...quote, status: e.target.value })}>
            <option value="NEW">Mới</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="QUOTED">Đã báo giá</option>
            <option value="WON">Thành công</option>
            <option value="LOST">Không thành công</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-white">
        <div className="flex items-center justify-between gap-4 border-b p-5">
          <div>
            <h2 className="text-xl font-black">Chi tiết sản phẩm</h2>
            <p className="mt-1 text-sm text-slate-500">Chọn sản phẩm có sẵn hoặc nhập nội dung tùy chỉnh.</p>
          </div>
          <button onClick={addLine} className="btn-secondary"><Plus className="mr-2 h-4 w-4" /> Thêm dòng</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3 w-24">SL</th>
                <th className="px-4 py-3 w-28">Đơn vị</th>
                <th className="px-4 py-3 w-40">Đơn giá</th>
                <th className="px-4 py-3 w-24">CK %</th>
                <th className="px-4 py-3 w-40 text-right">Thành tiền</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => {
                const lineTotal = item.quantity * item.unitPrice * (1 - item.discountRate / 100);
                return (
                  <tr key={item.id || index} className="border-t align-top">
                    <td className="p-3">
                      <select className={field} value={item.productId} onChange={(e) => selectProduct(index, e.target.value)}>
                        <option value="">Nhập sản phẩm tùy chỉnh</option>
                        {products.map((product) => <option key={product.id} value={product.id}>{product.sku ? `${product.sku} · ` : ""}{product.name}</option>)}
                      </select>
                      <input className={`${field} mt-2`} value={item.productName} onChange={(e) => updateLine(index, { productName: e.target.value })} placeholder="Tên sản phẩm" />
                      <input className={`${field} mt-2`} value={item.note} onChange={(e) => updateLine(index, { note: e.target.value })} placeholder="Ghi chú dòng" />
                    </td>
                    <td className="p-3"><input className={field} type="number" min="0" step="0.01" value={item.quantity} onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })} /></td>
                    <td className="p-3"><input className={field} value={item.unit} onChange={(e) => updateLine(index, { unit: e.target.value })} /></td>
                    <td className="p-3"><input className={field} type="number" min="0" step="1" value={item.unitPrice} onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })} /></td>
                    <td className="p-3"><input className={field} type="number" min="0" max="100" step="0.1" value={item.discountRate} onChange={(e) => updateLine(index, { discountRate: Number(e.target.value) })} /></td>
                    <td className="p-3 text-right font-bold">{money(lineTotal)} đ</td>
                    <td className="p-3"><button onClick={() => removeLine(index)} className="rounded-xl p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
              {!quote.items.length && <tr><td colSpan={7} className="p-10 text-center text-slate-500">Chưa có sản phẩm. Nhấn “Thêm dòng”.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border bg-white p-6">
          <textarea className={`${field} min-h-28`} value={quote.note} onChange={(e) => setQuote({ ...quote, note: e.target.value })} placeholder="Ghi chú báo giá" />
          <textarea className={`${field} mt-4 min-h-32`} value={quote.terms} onChange={(e) => setQuote({ ...quote, terms: e.target.value })} placeholder="Điều khoản" />
        </div>
        <div className="rounded-3xl border bg-white p-6">
          <div className="grid gap-4">
            <div className="flex justify-between"><span>Tạm tính</span><b>{money(totals.subtotal)} đ</b></div>
            <label className="flex items-center justify-between gap-4"><span>Chiết khấu</span><input className="w-24 rounded-xl border px-3 py-2 text-right" type="number" min="0" max="100" value={quote.discountRate} onChange={(e) => setQuote({ ...quote, discountRate: Number(e.target.value) })} /></label>
            <div className="flex justify-between text-slate-500"><span>Giảm</span><span>-{money(totals.discountValue)} đ</span></div>
            <label className="flex items-center justify-between gap-4"><span>VAT</span><input className="w-24 rounded-xl border px-3 py-2 text-right" type="number" min="0" max="100" value={quote.taxRate} onChange={(e) => setQuote({ ...quote, taxRate: Number(e.target.value) })} /></label>
            <div className="flex justify-between text-slate-500"><span>Tiền thuế</span><span>{money(totals.taxValue)} đ</span></div>
            <div className="border-t pt-4 flex justify-between text-xl font-black text-brand-800"><span>Tổng cộng</span><span>{money(totals.total)} đ</span></div>
          </div>
        </div>
      </section>

      {message && <div className="rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-brand-800">{message}</div>}
    </div>
  );
}
