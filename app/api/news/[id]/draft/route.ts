import { NextRequest, NextResponse } from "next/server";
import { draftSignal } from "@/lib/news/engine";

export const maxDuration = 120;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    let personaId: string | undefined;
    try {
      const body = await req.json();
      if (typeof body?.personaId === "string") personaId = body.personaId;
    } catch {
      /* no body */
    }
    const signal = await draftSignal(id, personaId);
    return NextResponse.json({ signal });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Draft failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
