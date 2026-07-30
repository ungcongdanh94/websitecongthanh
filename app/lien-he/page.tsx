import { site } from "@/data/site";

export default function ContactPage() {
  return (
    <section className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Liên hệ</div>
          <h1 className="section-title mt-3">Nhận tư vấn và báo giá nhanh</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Hãy gửi sản phẩm, số lượng hoặc nhu cầu công trình. Đội ngũ CÔNG THẢNH sẽ liên hệ lại.</p>
          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl bg-white p-5"><b>Địa chỉ:</b> {site.address}</div>
            <div className="rounded-2xl bg-white p-5"><b>Hotline:</b> {site.hotline}</div>
            <div className="rounded-2xl bg-white p-5"><b>Website:</b> {site.website}</div>
          </div>
        </div>
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-4">
            <input className="rounded-2xl border px-4 py-3" placeholder="Họ và tên" />
            <input className="rounded-2xl border px-4 py-3" placeholder="Số điện thoại" />
            <input className="rounded-2xl border px-4 py-3" placeholder="Sản phẩm quan tâm" />
            <textarea className="min-h-36 rounded-2xl border px-4 py-3" placeholder="Nội dung cần tư vấn" />
            <button type="button" className="btn-primary">Gửi yêu cầu</button>
            <p className="text-xs text-slate-500">Bản v0.1 đang là giao diện mẫu; chức năng lưu form sẽ được nối ở phiên bản backend.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
