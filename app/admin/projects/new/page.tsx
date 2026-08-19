import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <div className="eyebrow">Dự án</div>
        <h1 className="mt-3 text-4xl font-black">Thêm dự án mới</h1>
        <div className="mt-8"><ProjectForm /></div>
      </div>
    </main>
  );
}
