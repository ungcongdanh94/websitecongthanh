"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="print:hidden rounded-full bg-brand-800 px-5 py-3 font-bold text-white">
      <Printer className="mr-2 inline h-4 w-4" /> In hoặc lưu PDF
    </button>
  );
}
