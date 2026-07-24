import { promises as fs } from "fs";
import path from "path";
import { BRAIN_DIR } from "@/lib/brain";
import { callClaude } from "@/lib/models/claude";

export const KNOWLEDGE_DIR = path.join(BRAIN_DIR, "knowledge");

// seeded on first run; users can add/remove their own folders too
const DEFAULT_FOLDERS = [
  "carousels/visuals",
  "carousels/content",
  "carousels/caption",
  "case-studies",
  "blogs",
  "company-context",
];

export interface KnowledgeDoc {
  id: string; // relative path without .md (e.g. "blogs/my-post")
  folder: string; // "" for root
  title: string;
  sourceName: string;
  type: string;
  uploadedAt: string;
  chars: number;
}

const SUPPORTED = ["pdf", "docx", "doc", "txt", "md", "markdown"];
function extOf(name: string): string {
  return (name.split(".").pop() || "").toLowerCase();
}
function slugSeg(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}
/** Sanitize a relative folder/doc path — slugged segments, never escapes KB dir. */
function safeRel(rel: string): string {
  const cleaned = (rel || "")
    .split("/")
    .map((s) => slugSeg(s))
    .filter(Boolean)
    .join("/");
  const abs = path.resolve(KNOWLEDGE_DIR, cleaned);
  if (abs !== path.resolve(KNOWLEDGE_DIR) && !abs.startsWith(path.resolve(KNOWLEDGE_DIR) + path.sep))
    throw new Error("Invalid path.");
  return cleaned;
}

// ── directory / file walkers ─────────────────────────────────────────────────
async function walkDirs(dir: string, base = ""): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    out.push(rel);
    out.push(...(await walkDirs(path.join(dir, e.name), rel)));
  }
  return out;
}
async function walkMd(dir: string, base = ""): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const e of entries) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await walkMd(path.join(dir, e.name), rel)));
    else if (e.name.endsWith(".md")) out.push(rel.replace(/\.md$/, ""));
  }
  return out;
}

// ── folders ──────────────────────────────────────────────────────────────────
async function ensureDefaults(): Promise<void> {
  await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });
  if ((await walkDirs(KNOWLEDGE_DIR)).length === 0) {
    for (const d of DEFAULT_FOLDERS)
      await fs.mkdir(path.join(KNOWLEDGE_DIR, d), { recursive: true });
  }
}
export async function listFolders(): Promise<string[]> {
  await ensureDefaults();
  return (await walkDirs(KNOWLEDGE_DIR)).sort();
}
export async function createFolder(rel: string): Promise<string[]> {
  const r = safeRel(rel);
  if (!r) throw new Error("Folder name required.");
  await fs.mkdir(path.join(KNOWLEDGE_DIR, r), { recursive: true });
  return listFolders();
}
export async function deleteFolder(rel: string): Promise<string[]> {
  const r = safeRel(rel);
  if (!r) throw new Error("Invalid folder.");
  await fs.rm(path.join(KNOWLEDGE_DIR, r), { recursive: true, force: true });
  return listFolders();
}

// ── text extraction ──────────────────────────────────────────────────────────
export async function extractText(filename: string, buffer: Buffer): Promise<string> {
  const ext = extOf(filename);
  if (ext === "pdf") {
    // PDFParse is on the main entry; serverExternalPackages keeps it unbundled.
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const res = await parser.getText();
      return (res.text || "").trim();
    } finally {
      await parser.destroy();
    }
  }
  if (ext === "docx" || ext === "doc") {
    const mammoth = (await import("mammoth")).default;
    const res = await mammoth.extractRawText({ buffer });
    return (res.value || "").trim();
  }
  return buffer.toString("utf8").trim();
}

function parseFm(md: string): { data: Record<string, string>; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: md };
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > -1) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2].trim() };
}

// ── docs ─────────────────────────────────────────────────────────────────────
export async function saveKnowledgeDoc(
  filename: string,
  buffer: Buffer,
  folder = "",
): Promise<KnowledgeDoc> {
  const ext = extOf(filename);
  if (!SUPPORTED.includes(ext))
    throw new Error(`Unsupported file type: .${ext}. Use PDF, DOCX, TXT, or MD.`);
  const text = await extractText(filename, buffer);
  if (!text || text.length < 20)
    throw new Error("Couldn't extract readable text from that file.");

  const folderRel = folder ? safeRel(folder) : "";
  const dir = path.join(KNOWLEDGE_DIR, folderRel);
  await fs.mkdir(dir, { recursive: true });

  const title = filename.replace(/\.[^.]+$/, "");
  const base = slugSeg(title) || "doc";
  let slug = base;
  let n = 2;
  while (
    await fs
      .access(path.join(dir, `${slug}.md`))
      .then(() => true)
      .catch(() => false)
  ) {
    slug = `${base}-${n++}`;
  }
  const id = folderRel ? `${folderRel}/${slug}` : slug;
  const uploadedAt = new Date().toISOString();
  const md = [
    "---",
    `id: ${id}`,
    `folder: ${folderRel}`,
    `title: ${title}`,
    `sourceName: ${filename}`,
    `type: ${ext}`,
    `uploadedAt: ${uploadedAt}`,
    `chars: ${text.length}`,
    "---",
    "",
    `# ${title}`,
    "",
    text,
    "",
  ].join("\n");
  await fs.writeFile(path.join(KNOWLEDGE_DIR, `${id}.md`), md, "utf8");
  return { id, folder: folderRel, title, sourceName: filename, type: ext, uploadedAt, chars: text.length };
}

export async function listKnowledge(): Promise<KnowledgeDoc[]> {
  const rels = await walkMd(KNOWLEDGE_DIR);
  const docs: KnowledgeDoc[] = [];
  for (const rel of rels) {
    const md = await fs.readFile(path.join(KNOWLEDGE_DIR, `${rel}.md`), "utf8");
    const { data } = parseFm(md);
    const dir = path.posix.dirname(rel);
    docs.push({
      id: rel,
      folder: data.folder || (dir === "." ? "" : dir),
      title: data.title || path.posix.basename(rel),
      sourceName: data.sourceName || "",
      type: data.type || "",
      uploadedAt: data.uploadedAt || "",
      chars: Number(data.chars || 0),
    });
  }
  return docs.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function deleteKnowledge(id: string): Promise<void> {
  try {
    const r = safeRel(id);
    await fs.unlink(path.join(KNOWLEDGE_DIR, `${r}.md`));
  } catch {
    /* already gone */
  }
}

/** Concatenated company knowledge for grounding (bounded, recursive). */
export async function getKnowledgeContext(maxChars = 12000): Promise<string> {
  const rels = await walkMd(KNOWLEDGE_DIR);
  const parts: string[] = [];
  let total = 0;
  for (const rel of rels) {
    if (total >= maxChars) break;
    const md = await fs.readFile(path.join(KNOWLEDGE_DIR, `${rel}.md`), "utf8");
    const { data, body } = parseFm(md);
    const slice = body.slice(0, maxChars - total);
    parts.push(`### ${data.title || rel}\n${slice}`);
    total += slice.length;
  }
  return parts.join("\n\n");
}

export interface ExtractedBrief {
  name: string;
  topic: string;
  objective: string;
  icp: string;
  constraints: string;
}

/** Read an uploaded brief doc and pull campaign fields out of it via Claude. */
export async function extractBriefFromDoc(
  filename: string,
  buffer: Buffer,
): Promise<ExtractedBrief> {
  const text = await extractText(filename, buffer);
  if (!text || text.length < 20)
    throw new Error("Couldn't extract readable text from that file.");

  const system = `You extract a B2B content-campaign brief from a document. Return ONLY valid JSON with these keys:
{"name": "...", "topic": "...", "objective": "...", "icp": "...", "constraints": "..."}
- name: a short campaign name (<= 8 words). Infer one if not explicit.
- topic: what to research/write about.
- objective: what the content should achieve.
- icp: the target audience (roles, seniority, company profile).
- constraints: must-haves or things to avoid. Empty string if none.
Use ONLY what the document supports; leave a field "" if the document says nothing about it. Do not invent facts.`;
  const raw = await callClaude({
    system,
    user: `DOCUMENT:\n${text.slice(0, 20000)}`,
    maxTokens: 1200,
    webSearch: false,
  });
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Couldn't read a brief from that document.");
  const j = JSON.parse(m[0]);
  return {
    name: (j.name || "").trim(),
    topic: (j.topic || "").trim(),
    objective: (j.objective || "").trim(),
    icp: (j.icp || "").trim(),
    constraints: (j.constraints || "").trim(),
  };
}
