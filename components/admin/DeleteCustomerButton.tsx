"use client";

import { useRouter } from "next/navigation";

export default function DeleteCustomerButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Xóa khách hàng "${name}"? Các báo giá liên quan sẽ được giữ lại nhưng bỏ liên kết.`)) return;
    const response = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/admin/customers");
      router.refresh();
    } else {
      alert("Không thể xóa khách hàng");
    }
  }

  return (
    <button onClick={remove} className="font-semibold text-red-600">
      Xóa
    </button>
  );
}
