"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { KnowledgeDoc } from "@/lib/knowledge";

export default function KnowledgeBase({
  initialDocs,
}: {
  initialDocs: KnowledgeDoc[];
}) {
  const router = useRouter();
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/knowledge", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed on ${file.name}`);
        setDocs((cur) => [data.doc, ...cur.filter((d) => d.id !== data.doc.id)]);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function del(id: string) {
    const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDocs((cur) => cur.filter((d) => d.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col">
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center transition hover:border-border-strong"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,.md"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <div className="text-sm font-medium text-fg">
          {busy ? "Uploading…" : "Drop a file or click to upload"}
        </div>
        <div className="mt-1 text-xs text-faint">PDF, DOCX, TXT, MD</div>
      </div>

      {error && <p className="alert-error mt-3">{error}</p>}

      {docs.length > 0 && (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {docs.map((d) => (
            <li
              key={d.id}
              className="group flex items-center justify-between gap-2 px-4 py-3"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-fg">{d.title}</span>
                <span className="text-[11px] uppercase text-faint">
                  {d.type} · {(d.chars / 1000).toFixed(0)}k chars
                </span>
              </span>
              <button
                onClick={() => del(d.id)}
                title="Remove"
                className="shrink-0 text-faint opacity-0 transition hover:text-warn group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
