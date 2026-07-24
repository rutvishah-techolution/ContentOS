import { promises as fs } from "fs";
import path from "path";
import { BRAIN_DIR } from "@/lib/brain";

const RULEBOOK_PATH = path.join(BRAIN_DIR, "system", "persona-rulebook.md");

const PREAMBLE = `PERSONA RULEBOOK — apply these rules to the persona described below BEFORE you write. The persona file is a decision-making framework, not flavor text.`;

interface Section {
  heading: string;
  body: string;
}

let cache: Section[] | null = null;

async function loadSections(): Promise<Section[]> {
  if (cache) return cache;
  let md = "";
  try {
    md = await fs.readFile(RULEBOOK_PATH, "utf8");
  } catch {
    cache = [];
    return cache;
  }
  md = md.replace(/^---\n[\s\S]*?\n---\n?/, ""); // strip frontmatter
  const lines = md.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;
  for (const line of lines) {
    if (/^#{2,3}\s+/.test(line)) {
      if (cur) sections.push(cur);
      cur = { heading: line.trim(), body: "" };
    } else if (cur) {
      cur.body += line + "\n";
    }
  }
  if (cur) sections.push(cur);
  cache = sections;
  return sections;
}

/**
 * Returns the persona rulebook, sliced to the sections a stage needs — driven by
 * the rulebook's own Stage Activation Map. `"all"` = full activation (Draft 1):
 * the ten section-by-section entries plus the cross-cutting rules. Otherwise pass
 * heading prefixes (e.g. "### 8", "## Cross-persona").
 */
export async function getRulebook(want: "all" | string[]): Promise<string> {
  const sections = await loadSections();
  if (sections.length === 0) return "";

  const matchers =
    want === "all"
      ? [
          "## What a persona is",
          /^### \d+\./, // sections 1-10
          "## How the brief interacts",
          "## Cross-persona",
          "## Common failure modes",
          "## A note on the humanizer",
        ]
      : want;

  const chosen = sections.filter((s) =>
    matchers.some((m) =>
      typeof m === "string" ? s.heading.startsWith(m) : m.test(s.heading),
    ),
  );
  if (chosen.length === 0) return "";
  return `${PREAMBLE}\n\n${chosen
    .map((s) => `${s.heading}\n${s.body.trim()}`)
    .join("\n\n")}`;
}
