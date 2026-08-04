import type { Metadata } from "next";
import { Clock3, Facebook, Globe2, MapPin, MessageCircle, Phone } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Liên hệ và nhận báo giá | CÔNG THẢNH",
  description: "Gửi nhu cầu sản phẩm, số lượng hoặc thông tin công trình để CÔNG THẢNH tư vấn và báo giá.",
  alternates: { canonical: "/lien-he" }
};

export default function ContactPage() {
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || site.hotline;
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL || site.zaloUrl;
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;

  return (
    <section className="container-page py-16">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-brand-900 p-8 text-white lg:p-10">
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
            Liên hệ CÔNG THẢNH
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Nhận tư vấn và báo giá nhanh.
          </h1>
          <p className="mt-5 text-lg leading-8 text-brand-50/75">
            Gửi sản phẩm, số lượng hoặc nhu cầu công trình. Yêu cầu sẽ được lưu trực
            tiếp vào hệ thống để đội ngũ phụ trách tiếp nhận.
          </p>

          <div className="mt-10 grid gap-4">
            {site.locations.map((loc) => (
              <div key={loc.label} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-brand-300" />
                <div>
                  <div className="font-bold">{loc.label}</div>
                  <div className="mt-1 text-sm leading-6 text-brand-50/70">{loc.address}</div>
                  <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm font-semibold text-brand-100 hover:text-white">
                    {loc.phone}
                  </a>
                </div>
              </div>
            ))}
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Phone className="h-6 w-6 shrink-0 text-brand-300" />
              <div>
                <div className="font-bold">Hotline chung</div>
                <a href={`tel:${hotline.replace(/\s/g, "")}`} className="mt-1 block text-sm text-brand-50/70">
                  {hotline}
                </a>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Globe2 className="h-6 w-6 shrink-0 text-brand-300" />
              <div>
                <div className="font-bold">Website</div>
                <div className="mt-1 text-sm text-brand-50/70">congthanhco.com</div>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Clock3 className="h-6 w-6 shrink-0 text-brand-300" />
              <div>
                <div className="font-bold">Tiếp nhận yêu cầu</div>
                <div className="mt-1 text-sm text-brand-50/70">Trong giờ làm việc</div>
              </div>
            </div>
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <MessageCircle className="h-6 w-6 shrink-0 text-brand-300" />
                <span className="font-bold">Nhắn Zalo</span>
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <Facebook className="h-6 w-6 shrink-0 text-brand-300" />
                <span className="font-bold">Fanpage Facebook</span>
              </a>
            )}
          </div>
        </div>

        <div>
          <div className="eyebrow">Yêu cầu báo giá</div>
          <h2 className="mt-3 text-3xl font-black text-slate-950">
            Cho chúng tôi biết nhu cầu của bạn.
          </h2>
          <p className="mt-3 text-slate-600">
            Các trường có dấu * là bắt buộc.
          </p>
          <div className="mt-6">
            <QuoteForm />
          </div>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200">
        <iframe
          title={`Bản đồ ${site.name}`}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
          width="100%"
          height="380"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
