import { NextRequest, NextResponse } from "next/server";
import { createFolder } from "@/lib/knowledge";

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path || typeof path !== "string")
      return NextResponse.json({ error: "Folder name required." }, { status: 400 });
    const folders = await createFolder(path);
    return NextResponse.json({ folders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
