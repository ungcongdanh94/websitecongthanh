import CustomerForm from "@/components/admin/CustomerForm";

export const dynamic = "force-dynamic";

export default function NewCustomerPage() {
  return (
    <main className="container-page py-12">
      <div className="max-w-2xl">
        <div className="eyebrow">CRM</div>
        <h1 className="mt-3 text-4xl font-black">Thêm khách hàng</h1>
        <div className="mt-8">
          <CustomerForm />
        </div>
      </div>
    </main>
  );
}
