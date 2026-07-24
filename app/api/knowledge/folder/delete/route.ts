import { NextRequest, NextResponse } from "next/server";
import { deleteFolder } from "@/lib/knowledge";

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path || typeof path !== "string")
      return NextResponse.json({ error: "Folder required." }, { status: 400 });
    const folders = await deleteFolder(path);
    return NextResponse.json({ folders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
