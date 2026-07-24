"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { KnowledgeDoc } from "@/lib/knowledge";

const pretty = (s: string) =>
  s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default function KnowledgeBase({
  initialDocs,
  initialFolders,
}: {
  initialDocs: KnowledgeDoc[];
  initialFolders: string[];
}) {
  const router = useRouter();
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);
  const [folders, setFolders] = useState<string[]>(initialFolders);
  const [cur, setCur] = useState(""); // current folder path ("" = root)
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const prefix = cur ? cur + "/" : "";
  const childFolders = folders.filter((f) => {
    if (!f.startsWith(prefix)) return false;
    const rest = f.slice(prefix.length);
    return rest.length > 0 && !rest.includes("/");
  });
  const folderDocs = docs.filter((d) => d.folder === cur);
  const crumbs = cur ? cur.split("/") : [];

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", cur);
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

  async function addFolder() {
    if (!newFolder.trim()) return;
    setError(null);
    const p = cur ? `${cur}/${newFolder}` : newFolder;
    const res = await fetch("/api/knowledge/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: p }),
    });
    const data = await res.json();
    if (res.ok) {
      setFolders(data.folders);
      setNewFolder("");
      router.refresh();
    } else setError(data.error || "Couldn't create folder.");
  }

  async function delFolder(pathStr: string) {
    if (!confirm(`Delete folder "${pretty(pathStr.split("/").pop() || "")}" and everything in it?`))
      return;
    const res = await fetch("/api/knowledge/folder/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathStr }),
    });
    const data = await res.json();
    if (res.ok) {
      setFolders(data.folders);
      setDocs((cur) => cur.filter((d) => !(d.folder === pathStr || d.folder.startsWith(pathStr + "/"))));
      router.refresh();
    }
  }

  async function delDoc(id: string) {
    const res = await fetch("/api/knowledge/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setDocs((cur) => cur.filter((d) => d.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <button
          onClick={() => setCur("")}
          className={cur === "" ? "font-medium text-fg" : "text-muted hover:text-fg"}
        >
          All files
        </button>
        {crumbs.map((seg, i) => {
          const p = crumbs.slice(0, i + 1).join("/");
          const last = i === crumbs.length - 1;
          return (
            <span key={p} className="flex items-center gap-1.5">
              <span className="text-faint">/</span>
              <button
                onClick={() => setCur(p)}
                className={last ? "font-medium text-fg" : "text-muted hover:text-fg"}
              >
                {pretty(seg)}
              </button>
            </span>
          );
        })}
      </div>

      {/* folders in the current directory */}
      {childFolders.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {childFolders.map((f) => (
            <div
              key={f}
              className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 transition hover:border-border-strong"
            >
              <button
                onClick={() => setCur(f)}
                className="flex min-w-0 items-center gap-2 text-left"
              >
                <span className="text-muted">📁</span>
                <span className="truncate text-sm font-medium text-fg">
                  {pretty(f.split("/").pop() || f)}
                </span>
              </button>
              <button
                onClick={() => delFolder(f)}
                title="Delete folder"
                className="shrink-0 text-faint opacity-0 transition hover:text-warn group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* new folder + upload row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input max-w-[220px]"
          placeholder="New folder name"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addFolder()}
        />
        <button className="btn-ghost" onClick={addFolder} disabled={!newFolder.trim()}>
          + Folder
        </button>
      </div>

      {/* upload zone (uploads into the current folder) */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-8 text-center transition hover:border-border-strong"
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
        <div className="mt-1 text-xs text-faint">
          into <b>{cur ? pretty(cur.split("/").pop() || cur) : "All files"}</b> · PDF, DOCX, TXT, MD
        </div>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {/* docs in the current folder */}
      {folderDocs.length > 0 && (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {folderDocs.map((d) => (
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
                onClick={() => delDoc(d.id)}
                title="Remove"
                className="shrink-0 text-faint opacity-0 transition hover:text-warn group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {childFolders.length === 0 && folderDocs.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-sm text-faint">
          This folder is empty. Create a subfolder or upload a document.
        </p>
      )}
    </div>
  );
}
