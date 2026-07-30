import QuoteForm from "@/components/QuoteForm";
import { site } from "@/data/site";

export default function ContactPage() {
  return (
    <section className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Liên hệ</div>
          <h1 className="section-title mt-3">Nhận tư vấn và báo giá nhanh</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Gửi sản phẩm, số lượng hoặc nhu cầu công trình. Yêu cầu sẽ được lưu trực tiếp vào hệ thống.
          </p>
          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl bg-white p-5"><b>Địa chỉ:</b> {site.address}</div>
            <div className="rounded-2xl bg-white p-5"><b>Hotline:</b> {site.hotline}</div>
            <div className="rounded-2xl bg-white p-5"><b>Website:</b> {site.website}</div>
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
