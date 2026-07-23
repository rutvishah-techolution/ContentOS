---
campaign: "[[ai-value-finder-campaign]]"
persona: Auditor
personaId: auditor-persona
stream: campaign
model: claude
generatedAt: 2026-07-23T11:48:57.184Z
findingCount: 8
---

# Auditor — Raw Research

## Summary

The numbers tell a clean story: enterprises are spending like the ROI is proven, but the ROI is not on the books. MIT's NANDA study puts $30-40 billion into GenAI with 95% of pilots showing zero measurable P&L impact, and the failure is operational, not technical—brittle workflows and misalignment with day-to-day operations. Meanwhile the cost base is inverting: Microsoft pulled internal Claude Code licenses, Uber burned its entire 2026 coding budget in four months, and Nvidia's own VP says compute now costs more than the employees using it. The 'AI-pilled' top 1% spend $7,500 per employee monthly and rising 14.1% month-over-month, while roughly half of all SaaS licenses sit unused at $19.8M wasted per enterprise annually. A board-ready roadmap built from a company's actual invoices, utilization logs, and workflow map is not a nice-to-have—it is the only thing separating the 5% who extract value from the 95% funding a subsidy with a press release.

## Findings

### 1. Despite $30-40 billion in enterprise GenAI investment, 95% of pilots deliver zero measurable P&L impact, and the failure is operational rather than a model-quality problem.

- **Evidence:** MIT NANDA 'State of AI in Business 2025' study: 52 executive interviews, 153 leader surveys, 300 public deployments; only 5% of integrated systems created significant value; failures traced to brittle workflows, lack of contextual learning, and misalignment with day-to-day operations.
- **Source:** https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide
- **Why it matters:** This is the whole case for the engagement in one line item. The gap sits in the operations, not the software. A 3-day map of a company's actual workflows is exactly where the missing ROI hides—the same way $40 million in liabilities sat on page 34, not in the keynote.

### 2. MIT's data shows AI budgets are misallocated: money flows to sales and marketing while the better ROI sits in operations and finance, and externally-built tools succeed twice as often as internal builds.

- **Evidence:** The GenAI Divide identifies investment bias toward sales/marketing despite better returns in operations and finance; only two of nine sectors (Tech and Media) show material transformation; vendor-built tools succeed at 2x the rate of internal builds.
- **Source:** https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide
- **Why it matters:** CFOs are funding the wrong floor of the building. A roadmap that redirects spend from marketing demos to back-office unit-cost reduction is where the balance sheet actually moves. This is the specific line item a board should interrogate before the next renewal.

### 3. The heaviest AI adopters now spend $7,500 per employee per month on AI, growing 14.1% in a single month, while the median firm spends $11.38—a gap that reframes the debate on hard spend data rather than projections.

- **Evidence:** Ramp AI Index (June 2026), drawn from 70,000+ US firms: top 1% ('AI-pilled') spend $7.45K–$7,500/employee/month (~$90,000 annualized), top 10% spend $611, median spends $11.38; top-1% spend grew 14.1% month-over-month.
- **Source:** https://ramp.com/data/ai-index-june-2026
- **Why it matters:** This is the benchmark every board needs to place itself against. $7,500/employee/month is $9M annually for a 100-person unit. Before a CEO chases the top 1%, they need to know whether that spend is producing repeatable output or just funding a leaderboard. The number is either earning its keep or it is wrong.

### 4. Enterprise AI bills have tripled despite a 98% drop in per-token prices, because agentic tools drive roughly 30x higher cost per interaction and consume far more tokens per task.

- **Evidence:** GPT-4-level cost fell from ~$20 to ~$0.40 per million tokens (98% drop), yet total enterprise AI bills rose ~320%; a linear 2023 workflow cost ~$0.04 per interaction versus ~$1.20 for a 2026 agentic system (~30x); average corporate AI budgets rose from $1.2M (2024) to $7M (2026).
- **Source:** https://thenextweb.com/news/ai-pilled-firms-7500-per-employee-spending
- **Why it matters:** This is the trap CFOs miss: 'tokens are getting cheaper' is true and irrelevant. Cheaper unit price with 18x higher volume is a bigger invoice. Any roadmap that models scalability must track what happens to unit margins as query volume jumps—not the headline per-token price the vendor quotes.

### 5. Microsoft, one of AI's largest investors, revoked internal Claude Code licenses because token costs became untenable, and Nvidia's own VP admits compute now costs more than the employees using it.

- **Evidence:** Fortune (May 22, 2026): Microsoft (which writes up to 30% of its code with GenAI) instructed a major division to stop using an AI coding assistant; Uber burned its full 2026 AI coding budget in four months; Nvidia VP Bryan Catanzaro: 'For my team, the cost of compute is far beyond the costs of the employees.'
- **Source:** https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/
- **Why it matters:** When the vendor selling the shovels stops digging with them, the automation-saves-money narrative collapses. Any board betting on AI-driven headcount reduction is working off a cost model that the largest buyers have already disproven internally. Model the token bill before you model the layoffs.

### 6. Roughly half of all SaaS licenses go unused, wasting about $19.8 million per enterprise annually, and AI 'taxes' are inflating renewals by 20-37% regardless of proven adoption.

- **Evidence:** Zylo 2026 SaaS Management Index: only 54% of licenses used, $19.8M average annual waste per enterprise; Gartner estimates 30% of SaaS spend is 'toxic'; legacy vendors imposing 20-37% 'AI tax' price hikes on enterprise renewals, with 78% of IT leaders reporting unexpected charges.
- **Source:** https://www.varisource.com/blog/saas-spend-optimization-guide
- **Why it matters:** This is the audit's easiest win. Pull 90-day utilization logs, separate tools used weekly from tools abandoned after trial, and don't renew the dead ones. Reclaiming unused seats before renegotiation lowers the baseline the vendor prices against. Before buying more AI, stop paying for the shelfware you already own.

### 7. While 85% of organizations want to be 'agentic' within three years, the majority cannot execute: only 11-17% have moved agents to full production and roughly 73-83% lack the infrastructure to support them.

- **Evidence:** MIT Tech Review: 85% want agentic capability, 76% admit operations can't support it. Camunda 2026 report: 73% report a gap between intent and deployment, only 11% of use cases reached production. Google Cloud 2026 State of AI Infrastructure (1,402 IT leaders): only 17% fully confident their stack can support mission-critical agents.
- **Source:** https://www.technologyreview.com/2026/05/26/1137584/rethinking-organizational-design-in-the-age-of-agentic-ai/
- **Why it matters:** This is textbook pilot purgatory—ambition on the keynote slide, no infrastructure on the floor. A roadmap built from the company's own operational reality (data schemas, legacy integrations, ownership structures) is precisely what separates the 11-17% who ship from the majority buying demos. The pilot that impresses the room dies in the workflow it was never built for.

### 8. Even the AI-pilled generate no institutional learning: 99.5% of employees at heavy adopters use AI tools, yet companies capture no durable competitive advantage—the GenAI Paradox.

- **Evidence:** Ramp AI Index reports 99.5% of employees at top firms use AI and 84% engage weekly with coding agents; yet Uber's COO conceded token usage 'didn't seem to correlate directly with useful features shipped to users,' with ~70% of committed code AI-originated by March.
- **Source:** https://www.forbes.com/sites/jemmagreen/2026/07/02/ai-costs-more-than-the-people-it-replaced/
- **Why it matters:** Universal adoption is not value—it is workslop at scale. High usage with no shipped output is the operational equivalent of a 400% growth chart funded by credit swaps. The metric that matters is output tied to cost per workflow, not login counts. If usage doesn't reduce unit cost on the floor, it's budget being consumed, not scaled.

## Data

```json
{
  "summary": "The numbers tell a clean story: enterprises are spending like the ROI is proven, but the ROI is not on the books. MIT's NANDA study puts $30-40 billion into GenAI with 95% of pilots showing zero measurable P&L impact, and the failure is operational, not technical—brittle workflows and misalignment with day-to-day operations. Meanwhile the cost base is inverting: Microsoft pulled internal Claude Code licenses, Uber burned its entire 2026 coding budget in four months, and Nvidia's own VP says compute now costs more than the employees using it. The 'AI-pilled' top 1% spend $7,500 per employee monthly and rising 14.1% month-over-month, while roughly half of all SaaS licenses sit unused at $19.8M wasted per enterprise annually. A board-ready roadmap built from a company's actual invoices, utilization logs, and workflow map is not a nice-to-have—it is the only thing separating the 5% who extract value from the 95% funding a subsidy with a press release.",
  "findings": [
    {
      "claim": "Despite $30-40 billion in enterprise GenAI investment, 95% of pilots deliver zero measurable P&L impact, and the failure is operational rather than a model-quality problem.",
      "evidence": "MIT NANDA 'State of AI in Business 2025' study: 52 executive interviews, 153 leader surveys, 300 public deployments; only 5% of integrated systems created significant value; failures traced to brittle workflows, lack of contextual learning, and misalignment with day-to-day operations.",
      "sourceUrl": "https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide",
      "sourceTitle": "MIT Report Finds 95% of AI Pilots Fail to Deliver ROI, Exposing \"GenAI Divide\"",
      "whyItMatters": "This is the whole case for the engagement in one line item. The gap sits in the operations, not the software. A 3-day map of a company's actual workflows is exactly where the missing ROI hides—the same way $40 million in liabilities sat on page 34, not in the keynote."
    },
    {
      "claim": "MIT's data shows AI budgets are misallocated: money flows to sales and marketing while the better ROI sits in operations and finance, and externally-built tools succeed twice as often as internal builds.",
      "evidence": "The GenAI Divide identifies investment bias toward sales/marketing despite better returns in operations and finance; only two of nine sectors (Tech and Media) show material transformation; vendor-built tools succeed at 2x the rate of internal builds.",
      "sourceUrl": "https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide",
      "sourceTitle": "MIT Report Finds 95% of AI Pilots Fail to Deliver ROI, Exposing \"GenAI Divide\"",
      "whyItMatters": "CFOs are funding the wrong floor of the building. A roadmap that redirects spend from marketing demos to back-office unit-cost reduction is where the balance sheet actually moves. This is the specific line item a board should interrogate before the next renewal."
    },
    {
      "claim": "The heaviest AI adopters now spend $7,500 per employee per month on AI, growing 14.1% in a single month, while the median firm spends $11.38—a gap that reframes the debate on hard spend data rather than projections.",
      "evidence": "Ramp AI Index (June 2026), drawn from 70,000+ US firms: top 1% ('AI-pilled') spend $7.45K–$7,500/employee/month (~$90,000 annualized), top 10% spend $611, median spends $11.38; top-1% spend grew 14.1% month-over-month.",
      "sourceUrl": "https://ramp.com/data/ai-index-june-2026",
      "sourceTitle": "How much does it cost to be AI-pilled?",
      "whyItMatters": "This is the benchmark every board needs to place itself against. $7,500/employee/month is $9M annually for a 100-person unit. Before a CEO chases the top 1%, they need to know whether that spend is producing repeatable output or just funding a leaderboard. The number is either earning its keep or it is wrong."
    },
    {
      "claim": "Enterprise AI bills have tripled despite a 98% drop in per-token prices, because agentic tools drive roughly 30x higher cost per interaction and consume far more tokens per task.",
      "evidence": "GPT-4-level cost fell from ~$20 to ~$0.40 per million tokens (98% drop), yet total enterprise AI bills rose ~320%; a linear 2023 workflow cost ~$0.04 per interaction versus ~$1.20 for a 2026 agentic system (~30x); average corporate AI budgets rose from $1.2M (2024) to $7M (2026).",
      "sourceUrl": "https://thenextweb.com/news/ai-pilled-firms-7500-per-employee-spending",
      "sourceTitle": "The most AI-obsessed companies spend $7,500 per employee per month. The median spends $11.",
      "whyItMatters": "This is the trap CFOs miss: 'tokens are getting cheaper' is true and irrelevant. Cheaper unit price with 18x higher volume is a bigger invoice. Any roadmap that models scalability must track what happens to unit margins as query volume jumps—not the headline per-token price the vendor quotes."
    },
    {
      "claim": "Microsoft, one of AI's largest investors, revoked internal Claude Code licenses because token costs became untenable, and Nvidia's own VP admits compute now costs more than the employees using it.",
      "evidence": "Fortune (May 22, 2026): Microsoft (which writes up to 30% of its code with GenAI) instructed a major division to stop using an AI coding assistant; Uber burned its full 2026 AI coding budget in four months; Nvidia VP Bryan Catanzaro: 'For my team, the cost of compute is far beyond the costs of the employees.'",
      "sourceUrl": "https://fortune.com/2026/05/22/microsoft-ai-cost-problem-tokens-agents/",
      "sourceTitle": "Microsoft reports are exposing AI's real cost problem: Using the tech is more expensive than paying human employees",
      "whyItMatters": "When the vendor selling the shovels stops digging with them, the automation-saves-money narrative collapses. Any board betting on AI-driven headcount reduction is working off a cost model that the largest buyers have already disproven internally. Model the token bill before you model the layoffs."
    },
    {
      "claim": "Roughly half of all SaaS licenses go unused, wasting about $19.8 million per enterprise annually, and AI 'taxes' are inflating renewals by 20-37% regardless of proven adoption.",
      "evidence": "Zylo 2026 SaaS Management Index: only 54% of licenses used, $19.8M average annual waste per enterprise; Gartner estimates 30% of SaaS spend is 'toxic'; legacy vendors imposing 20-37% 'AI tax' price hikes on enterprise renewals, with 78% of IT leaders reporting unexpected charges.",
      "sourceUrl": "https://www.varisource.com/blog/saas-spend-optimization-guide",
      "sourceTitle": "SaaS Spend Optimization: 2026 Complete Guide to Cost Savings",
      "whyItMatters": "This is the audit's easiest win. Pull 90-day utilization logs, separate tools used weekly from tools abandoned after trial, and don't renew the dead ones. Reclaiming unused seats before renegotiation lowers the baseline the vendor prices against. Before buying more AI, stop paying for the shelfware you already own."
    },
    {
      "claim": "While 85% of organizations want to be 'agentic' within three years, the majority cannot execute: only 11-17% have moved agents to full production and roughly 73-83% lack the infrastructure to support them.",
      "evidence": "MIT Tech Review: 85% want agentic capability, 76% admit operations can't support it. Camunda 2026 report: 73% report a gap between intent and deployment, only 11% of use cases reached production. Google Cloud 2026 State of AI Infrastructure (1,402 IT leaders): only 17% fully confident their stack can support mission-critical agents.",
      "sourceUrl": "https://www.technologyreview.com/2026/05/26/1137584/rethinking-organizational-design-in-the-age-of-agentic-ai/",
      "sourceTitle": "Rethinking organizational design in the age of agentic AI",
      "whyItMatters": "This is textbook pilot purgatory—ambition on the keynote slide, no infrastructure on the floor. A roadmap built from the company's own operational reality (data schemas, legacy integrations, ownership structures) is precisely what separates the 11-17% who ship from the majority buying demos. The pilot that impresses the room dies in the workflow it was never built for."
    },
    {
      "claim": "Even the AI-pilled generate no institutional learning: 99.5% of employees at heavy adopters use AI tools, yet companies capture no durable competitive advantage—the GenAI Paradox.",
      "evidence": "Ramp AI Index reports 99.5% of employees at top firms use AI and 84% engage weekly with coding agents; yet Uber's COO conceded token usage 'didn't seem to correlate directly with useful features shipped to users,' with ~70% of committed code AI-originated by March.",
      "sourceUrl": "https://www.forbes.com/sites/jemmagreen/2026/07/02/ai-costs-more-than-the-people-it-replaced/",
      "sourceTitle": "AI Costs More Than The People It Replaced",
      "whyItMatters": "Universal adoption is not value—it is workslop at scale. High usage with no shipped output is the operational equivalent of a 400% growth chart funded by credit swaps. The metric that matters is output tied to cost per workflow, not login counts. If usage doesn't reduce unit cost on the floor, it's budget being consumed, not scaled."
    }
  ],
  "error": null
}
```

