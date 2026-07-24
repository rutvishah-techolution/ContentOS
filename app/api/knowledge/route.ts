import { NextRequest, NextResponse } from "next/server";
import { listKnowledge, listFolders, saveKnowledgeDoc } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export async function GET() {
  const [docs, folders] = await Promise.all([listKnowledge(), listFolders()]);
  return NextResponse.json({ docs, folders });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "");
    if (!(file instanceof File))
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await saveKnowledgeDoc(file.name, buffer, folder);
    return NextResponse.json({ doc }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
