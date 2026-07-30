import Image from "next/image";

const projects = [
  ["Biệt thự cửa nhôm cao cấp", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"],
  ["Không gian bếp hiện đại", "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80"],
  ["Cửa lùa mở rộng tầm nhìn", "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80"],
  ["Nội thất nhôm sang trọng", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"]
];

export default function ProjectsPage() {
  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Dự án</div>
        <h1 className="section-title mt-3">Không gian thực tế, giải pháp thực tế</h1>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map(([title, image]) => (
          <article key={title} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative aspect-[16/10]"><Image src={image} alt={title} fill className="object-cover" /></div>
            <h2 className="p-6 text-2xl font-bold">{title}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}
