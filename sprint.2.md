# Sprint 2 – LLM Streaming + Code Parsing

## Objective
Stream code from LLM and extract runnable output.

## Tasks
- Integrate LLM API (Gemini) - cheapest model with the best outputs while being cost effective
- Stream response tokens
- Strip markdown formatting
- Extract:
  - React component
  - Tailwind classes
- Store raw + cleaned code in state

## Acceptance Criteria
- Streaming visible in UI
- Clean JSX produced
- No markdown fences remain
