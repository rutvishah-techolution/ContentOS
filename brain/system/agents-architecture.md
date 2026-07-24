---
title: ContentOS — Agents & Architecture
updated: 2026-07-24
---

# ContentOS — Agents & Architecture Map

Every "agent" here is an LLM call with a specific role. This maps all of them,
what they do, which model runs them, and where their prompt lives.

---

## 0. Model transport layer (`lib/models/`)

These aren't agents — they're the pipes every agent runs through.

| Backend | File | Notes |
|---|---|---|
| **Claude** (Azure AI Foundry) | `claude.ts` → `callClaude` | Optional `web_search` server tool (max 6 uses). Retry/backoff. |
| **Gemini** (Google Vertex) | `gemini.ts` → `callGemini`, `groundedRaw`, `groundedSearch` | Google-Search grounding is ALWAYS on. `groundedRaw`/`groundedSearch` return text + real source URLs. |
| **Grok / DeepSeek** (Azure, OpenAI-compatible) | `openaiCompatible.ts` → `callOpenAICompatible` | **Hybrid web_search**: exposes a `web_search` tool and fulfils each call via **Gemini grounding** (`groundedSearch`). MAX_TOOL_STEPS=8, forced answer on last step. |
| **Router** | `router.ts` → `callModel(model, opts)` | Routes to the right backend by model name. |

**Personas → model mapping** (each research/writing agent runs on its persona's model):

| Persona | Stream | Model |
|---|---|---|
| Auditor | campaign | claude |
| Doctor | campaign | gemini |
| Policy Insider | campaign | grok |
| Feed | scout | gemini |
| Interviewer | scout | gemini |
| AI for Humans | scout | gemini |

---

## Pipeline flowchart

```
                         ┌─────────────────────────────────────────────┐
                         │  STAGE 0 · CREATE CAMPAIGN                    │
                         │  (optional) Brief Extractor [Claude]         │
                         │  PDF/DOC → {name,topic,objective,icp,...}    │
                         └───────────────────────┬─────────────────────┘
                                                 ▼
┌───────────────────────────── STAGE 1 · RESEARCH ─────────────────────────────┐
│                                                                               │
│  syncDigest (git pull, no LLM) ──► daily news items                           │
│                                                                               │
│  A. Article Selector  ×N personas  [persona's model]  (round-robin, no dupes) │
│     persona + digest → picks the articles it wants                            │
│                         │                                                      │
│                         ▼                                                      │
│  B. Persona Researcher ×N personas  [persona's model + WEB SEARCH]  (parallel)│
│     3 campaign personas → campaign topic   |   3 scouts → broader AI landscape │
│     → Findings JSON (claim + real source URL + why-it-matters)                 │
│                         │                                                      │
│                         ▼                                                      │
│  C. Source-Check (per finding):                                               │
│     • Deterministic (NO LLM): figure-match, source tier, dead-link (fetchUrl) │
│     • Context-Check agent [Claude, batched] → does the source sentence really │
│       support the claim + its number?                                          │
│                         │                                                      │
│                         ▼                                                      │
│  D. Research Synthesizer  ×2  [Claude]                                         │
│     validated findings → "Campaign research base" + "Scout research base"      │
│                         │                                                      │
│                         ▼   ── human APPROVE / send-back (feedback loops to B) │
└─────────────────────────────────────┬─────────────────────────────────────────┘
                                       ▼
┌────────────────────────── STAGE 2 · STORYLINE ───────────────────────────────┐
│  E. Topic Strategist ("editor")  [Claude]                                     │
│     brief + campaign base + scout base + knowledge + ALL personas             │
│     → spine + ≥4 topics/channel, each tagged campaign|thought-leadership +     │
│       assigned a best-fit persona.   (topic bank / shelf)                      │
│                         │  user checks topics                                  │
│                         ▼                                                      │
│  F. Storyline Writer  ×selected  [Claude, persona voice]                      │
│     topic → villain→shift→hero→proof→learning→CTA                             │
│  F'. Storyline Reviser [Claude, chat-with-memory]  (on user feedback)         │
│                         │  human APPROVE (toggle)                              │
└─────────────────────────────────────┬─────────────────────────────────────────┘
                                       ▼
┌────────────────────────── STAGE 3 · DRAFTING (per piece, gated) ─────────────┐
│  G. Draft 1 Writer   [Claude, persona voice]  storyline → full copy           │
│        (grounding + source-balance + optional user instructions)              │
│           │ approve → step forward                                             │
│  H. Draft 2 Editor   [Claude]  craft-rules + reader-psychology (no new facts) │
│           │ approve → step forward                                             │
│  I. Final Humanizer  [Claude]  humanizer.md (kill AI patterns, em-dashes, GEO)│
│           │                                                                    │
│  J. Draft Assistant  [Gemini, grounded]  side-panel: fact-check / Q&A / edits │
│                         │  human APPROVE → Workspace (Final copy)              │
└───────────────────────────────────────────────────────────────────────────────┘

┌═══════════════ NEWS ENGINE · global, reactive (parallel to campaigns) ═══════════┐
│  K. News Searcher  ×active beats  [Gemini grounded]  → fresh news (24-72h)+URLs │
│                         ▼                                                        │
│  L. News Editorial Director (triage)  [Claude, skeptical]                       │
│     findings + digest → judged Signals (time-sensitivity, relevance, angle,     │
│     go/no-go + WHY, best-fit persona). dedup vs seen-ledger.                     │
│     + Source-Check each (fetchUrl resolves Gemini redirects, drops dead)         │
│                         ▼                                                        │
│  M. News Draft Writer  [Claude, chosen persona] → LinkedIn carousel POV,        │
│     grounded in the real article, closes with AI ValueFinder intro (slide 7-8)  │
│  N. News Humanizer     [Claude]                                                 │
│                         ▼  human APPROVE                                         │
└══════════════════════════════════════════════════════════════════════════════════┘
```

---

## Agent-by-agent detail

### 0 · Brief Extractor  (optional)
- **Model:** Claude · **File:** `lib/knowledge.ts` → `extractBriefFromDoc`
- **Does:** reads an uploaded PDF/DOCX/TXT brief and pulls campaign fields.
- **Prompt gist:** *"Extract a B2B content-campaign brief. Return ONLY JSON {name, topic, objective, icp, constraints}. Use ONLY what the document supports; don't invent."*
- **Web search:** off.

### A · Article Selector  (×N, round-robin)
- **Model:** the persona's model · **File:** `lib/research/selection.ts` → `pickForPersona`
- **Does:** each persona autonomously picks the digest articles it wants to write about, in character; picks are removed so no two personas take the same one (floor of 4).
- **Prompt gist:** persona file + *"You are choosing which of today's news articles YOU want to write about — as this exact persona. Pick only what genuinely fits."* → `{"picks":[numbers]}`.
- **Web search:** off.

### B · Persona Researcher  (×N, the core parallel swarm)
- **Model:** the persona's model (Claude/Gemini/Grok) · **File:** `lib/research/orchestrator.ts` (`runOnePersona`) + `lib/research/prompt.ts` (`buildSystemPrompt`/`buildUserPrompt`)
- **Does:** each persona researches through its own lens — campaign personas dig the campaign topic, scouts scan the broader AI landscape — producing grounded findings.
- **Prompt gist:** *the persona file IS the system prompt*, plus hard rules: use web_search, every claim needs a real publisher URL (no redirects), prefer last 3-6 months, prefer primary sources, stay in character. → Findings JSON (claim, sourceUrl, whyItMatters).
- **Web search:** ON.

### C · Context-Check  (validation)
- **Model:** Claude (batched) · **File:** `lib/research/verify.ts` → `batchContextCheck`  (paired with deterministic figure-match + source-tier + dead-link in `verify.ts` / `fetchSource.ts`)
- **Does:** for claims whose number can't be deterministically matched, checks whether the source sentence actually supports the claim + its figure.
- **Prompt gist:** *"Set supports=true ONLY if the sentence clearly backs the claim's point AND its number."* → `{"results":[{index,supports}]}`.
- **Web search:** off.

### D · Research Synthesizer  (×2: campaign + scout)
- **Model:** Claude · **File:** `lib/research/sourceCheck.ts` → `synthesizeBase`
- **Does:** turns validated findings into one clean research base per stream.
- **Prompt gist:** *"You are a neutral research synthesizer, NOT a persona. Organize findings into 3-6 themed sections, preserve every citation as a markdown link, invent nothing, no confidence labels."*
- **Web search:** off. → **human approve / send-back** (feedback re-runs B).

### E · Topic Strategist  (the "editor" for topics)
- **Model:** Claude · **File:** `lib/storyline/topics.ts` → `generateTopics`
- **Does:** reads brief + both research bases + knowledge + the full persona roster; produces the campaign **spine** and ≥4 topics per channel, each tagged **campaign** vs **thought-leadership** and assigned a best-fit persona.
- **Prompt gist:** *"You are a B2B content strategist. Two kinds of topic (campaign / thought-leadership). Ground every option in the research. Assign the best-fit persona."*
- **Web search:** off.

### F · Storyline Writer / F' · Reviser
- **Model:** Claude (in the assigned persona's voice) · **File:** `lib/storyline/storyline.ts`
- **Does:** turns a chosen topic into a villain→shift→hero→proof→learning→CTA skeleton (F). The Reviser (F') edits it via chat-with-memory on user feedback.
- **Prompt gist:** grounding + storyline structure + craft + reader-psychology + brand + persona voice; intent guidance switches CTA by campaign vs thought-leadership.
- **Web search:** off.

### G/H/I · Draft pipeline  (per piece, gated)
- **Model:** Claude · **File:** `lib/draft/draft.ts`
- **G · Draft 1 Writer** (`writePass`): storyline → full copy, persona voice, channel format rules, grounding, source-balance, optional user instructions.
- **H · Draft 2 Editor** (`editPass`): enforce `craft-rules.md` + `reader-psychology.md`, no new facts, keep voice.
- **I · Final Humanizer** (`humanizePass`): `humanizer.md` — remove AI patterns, strip em-dashes, GEO.
- **Web search:** off. Each stage is human-approved before the next.

### J · Draft Assistant  (side panel)
- **Model:** Gemini (grounded) · **File:** `lib/draft/draft.ts` → `assistDraft`
- **Does:** per-draft help chat — fact-check figures against research + sources (and the web), answer questions, edit the draft on request.
- **Web search:** ON (grounded).

### K · News Searcher  (×active beats)
- **Model:** Gemini grounded · **File:** `lib/news/engine.ts` (`scan`) + `lib/news/prompts.ts` (`searchPrompt`)
- **Does:** one grounded search per beat for real news in the last 24-72h, freshest-first, reputable sources.
- **Web search:** ON.

### L · News Editorial Director  (triage)
- **Model:** Claude (skeptical) · **File:** `lib/news/engine.ts` + `lib/news/prompts.ts` (`triageSystem`/`triageUser`)
- **Does:** judges every candidate — time-sensitivity, relevance to ICP, angle strength, **go/no-go + a one-line why** — assigns a best-fit persona, dedups. Default is NO. Then each kept item is source-checked (`fetchUrl` resolves Gemini redirect URLs, drops dead links).
- **Web search:** off (judges the findings).

### M/N · News Draft Writer + Humanizer
- **Model:** Claude (chosen persona) · **File:** `lib/news/engine.ts` → `draftSignal` + `lib/news/prompts.ts` (`draftSystem`)
- **Does:** writes a LinkedIn **carousel POV**, grounded in the **real article text** (fetched), source-balanced; closing slides (7-8) smoothly introduce **AI ValueFinder**. Then a humanizer pass.
- **Web search:** off.

---

## Human gates (not agents, but part of the flow)
1. **Research** → approve / send-back (feedback re-runs the researchers).
2. **Storyline** → approve each piece (toggle).
3. **Draft** → approve each stage (Draft 1 → 2 → Final).
4. **News** → approve each signal.

## Anti-hallucination spine
Grounding on every writing agent, no web at storyline/draft, deterministic figure-match + context-check in research, fetchUrl dead-link/redirect guard, and a fact-trace check on every draft against the research + brand.
