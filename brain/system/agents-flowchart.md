---
title: ContentOS — Agent Flowchart
note: local only (not pushed to GitHub)
---

# ContentOS — Agent Flowchart

> Open in Obsidian (or any Mermaid viewer) to see the rendered diagram.
> Blue = AI agent · Grey = data store · Amber = human gate.

```mermaid
flowchart TD
  %% ---------- data sources ----------
  DIG[("Daily digest<br/>(git pull · no LLM)")]:::data
  KB[("Knowledge base<br/>(uploaded docs)")]:::data
  PB[("Persona files ×6<br/>3 campaign + 3 scout")]:::data

  %% ---------- Stage 0 ----------
  subgraph S0["STAGE 0 · Create campaign"]
    BE["A0 · Brief Extractor<br/><i>Claude</i><br/>PDF/DOC → brief fields"]:::agent
  end
  BE --> BRIEF[("Campaign brief")]:::data

  %% ---------- Stage 1 ----------
  subgraph S1["STAGE 1 · Research"]
    AS["A · Article Selectors ×6<br/><i>each persona's model</i><br/>round-robin pick, in character"]:::agent
    RC["B · Persona Researchers ×3 campaign<br/><i>persona model + WEB SEARCH</i>"]:::agent
    RS["B · Scout Researchers ×3<br/><i>persona model + WEB SEARCH</i>"]:::agent
    SC["C · Source-Check<br/>figure-match + dead-link (no LLM)<br/>+ Context-Check <i>Claude</i>"]:::agent
    SY1["D · Synthesizer → Campaign base<br/><i>Claude</i>"]:::agent
    SY2["D · Synthesizer → Scout base<br/><i>Claude</i>"]:::agent
  end
  BRIEF --> AS
  DIG --> AS
  PB --> AS
  AS --> RC
  AS --> RS
  RC --> SC
  RS --> SC
  SC --> SY1
  SC --> SY2
  SY1 --> CB[("Campaign research base")]:::data
  SY2 --> SB[("Scout research base")]:::data
  CB --> G1{{"HUMAN GATE<br/>Approve / Send-back"}}:::gate
  SB --> G1
  G1 -. "send-back (feedback re-runs researchers)" .-> RC
  G1 -. send-back .-> RS

  %% ---------- Stage 2 ----------
  subgraph S2["STAGE 2 · Storyline"]
    TS["E · Topic Strategist (the editor)<br/><i>Claude</i><br/>spine + topics/channel<br/>tag campaign|thought-leadership<br/>assign best-fit persona"]:::agent
    SW["F · Storyline Writer<br/><i>Claude · persona voice</i><br/>villain→hero skeleton"]:::agent
    SR["F' · Storyline Reviser<br/><i>Claude · chat-with-memory</i>"]:::agent
  end
  G1 --> TS
  KB --> TS
  SB --> TS
  TS --> BANK[("Topic bank / shelf")]:::data
  BANK -->|user checks topics| SW
  SW --> SR
  SW --> G2{{"HUMAN GATE<br/>Approve storyline (toggle)"}}:::gate
  SR --> G2

  %% ---------- Stage 3 ----------
  subgraph S3["STAGE 3 · Drafting (per piece, gated)"]
    D1["G · Draft 1 Writer<br/><i>Claude · persona</i><br/>+ your instructions"]:::agent
    D2["H · Draft 2 Editor<br/><i>Claude</i><br/>craft + reader-psychology"]:::agent
    D3["I · Final Humanizer<br/><i>Claude</i><br/>kill AI patterns · GEO"]:::agent
    DA["J · Draft Assistant<br/><i>Gemini · grounded</i><br/>fact-check / Q&A / edit"]:::agent
  end
  G2 --> D1
  D1 -->|approve| D2
  D2 -->|approve| D3
  DA -.-> D1
  DA -.-> D2
  DA -.-> D3
  D3 --> G3{{"HUMAN GATE<br/>Approve final"}}:::gate
  G3 --> WS[("Workspace · Final copy")]:::data

  %% ---------- News engine ----------
  subgraph NE["NEWS ENGINE · reactive, global (parallel)"]
    NK["K · News Searchers<br/><i>Gemini grounded · per beat</i><br/>fresh news 24-72h + URLs"]:::agent
    NL["L · Editorial Director / triage<br/><i>Claude · skeptical</i><br/>go/no-go + why + persona"]:::agent
    NM["M · News Writer<br/><i>Claude · chosen persona</i><br/>carousel · closes w/ ValueFinder"]:::agent
    NN["N · News Humanizer<br/><i>Claude</i>"]:::agent
  end
  DIG --> NL
  NK --> NL
  NL --> SIG[("Signals + go/no-go")]:::data
  SIG -->|Draft this take| NM
  NM --> NN --> G4{{"HUMAN GATE<br/>Approve signal"}}:::gate
  G4 --> WS

  classDef agent fill:#e8edff,stroke:#3b5bdb,color:#10173a;
  classDef data fill:#f4f4f2,stroke:#9a9a94,color:#333;
  classDef gate fill:#fff1d6,stroke:#b45309,color:#5a3a10;
```

## Model backbone (how each agent reaches an LLM)
- **Claude** (Azure) — most reasoning/writing agents; optional web_search.
- **Gemini** (Vertex) — grounding always on; also the live-search backend.
- **Grok / DeepSeek** (Azure, OpenAI-compat) — `web_search` fulfilled by Gemini grounding (hybrid).
- **Router** `callModel()` selects the backend by the persona's `model:` field.

Personas → model: Auditor=Claude · Doctor=Gemini · Policy Insider=Grok · Feed/Interviewer/AI-for-Humans=Gemini.
