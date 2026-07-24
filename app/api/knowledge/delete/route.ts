import { NextRequest, NextResponse } from "next/server";
import { deleteKnowledge } from "@/lib/knowledge";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== "string")
      return NextResponse.json({ error: "id required." }, { status: 400 });
    await deleteKnowledge(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Delete failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
