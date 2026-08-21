"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  Code2
} from "lucide-react";

type Asset = { id: string; secureUrl: string; fileName: string };

const COLORS = ["#0f172a", "#146f47", "#dc2626", "#2563eb", "#ca8a04", "#ffffff"];

function ImagePickerModal({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((result) => setAssets(result.assets || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <div className="text-lg font-black">Chọn ảnh để chèn</div>
          <button type="button" onClick={onClose} className="rounded-xl px-3 py-1 text-sm font-bold hover:bg-slate-100">Đóng</button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Đang tải thư viện...</div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {assets.map((asset) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={asset.id}
                  src={asset.secureUrl}
                  alt={asset.fileName}
                  onClick={() => onPick(asset.secureUrl)}
                  className="h-28 w-full cursor-pointer rounded-xl border object-cover hover:ring-2 hover:ring-brand-500"
                />
              ))}
              {!assets.length && <div className="col-span-full py-10 text-center text-slate-500">Chưa có ảnh nào trong thư viện.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RichTextEditor({
  name,
  defaultValue = "",
  placeholder
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder || "Nhập mô tả..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] })
    ],
    content: defaultValue,
    editorProps: {
      attributes: { class: "min-h-40 p-4 text-sm leading-6 outline-none prose-sm max-w-none" }
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML())
  });

  if (!editor) return null;

  function insertLink() {
    const url = window.prompt("Nhập URL:");
    if (!url) return;
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn = (active: boolean) =>
    `rounded-lg p-2 hover:bg-slate-200 ${active ? "bg-slate-200 text-brand-700" : ""}`;

  return (
    <div>
      <input type="hidden" name={name} value={html} />
      <div className="flex flex-wrap items-center gap-1 rounded-t-2xl border border-b-0 border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Đậm"><Bold className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Nghiêng"><Italic className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Gạch chân"><UnderlineIcon className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => editor.chain().focus().setColor(color).run()}
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Danh sách"><List className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Danh sách số"><ListOrdered className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(editor.isActive({ textAlign: "left" }))} title="Căn trái"><AlignLeft className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(editor.isActive({ textAlign: "center" }))} title="Căn giữa"><AlignCenter className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btn(editor.isActive({ textAlign: "right" }))} title="Căn phải"><AlignRight className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <button type="button" onClick={insertLink} className={btn(editor.isActive("link"))} title="Liên kết"><Link2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => setShowImagePicker(true)} className="rounded-lg p-2 hover:bg-slate-200" title="Chèn ảnh"><ImageIcon className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="rounded-lg p-2 hover:bg-slate-200" title="Hoàn tác"><Undo className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="rounded-lg p-2 hover:bg-slate-200" title="Làm lại"><Redo className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-300" />
        <button type="button" onClick={() => setShowCode((v) => !v)} className={btn(showCode)} title="Xem mã HTML"><Code2 className="h-4 w-4" /></button>
      </div>

      <EditorContent editor={editor} className="rounded-b-2xl border border-slate-200 bg-white" />

      {showCode && (
        <textarea
          readOnly
          value={html}
          className="mt-2 h-32 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600"
        />
      )}

      {showImagePicker && (
        <ImagePickerModal
          onClose={() => setShowImagePicker(false)}
          onPick={(url) => {
            editor.chain().focus().setImage({ src: url }).run();
            setShowImagePicker(false);
          }}
        />
      )}
    </div>
  );
}
