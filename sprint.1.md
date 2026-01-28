# Sprint 1 – Prompt Orchestrator

## Objective
Convert structured UI state into a deterministic super-prompt.

## Tasks
- Define designConfig schema:
  - layout
  - style
  - theme
  - animation
- Create mapping functions:
  - layout → description
  - style → Tailwind patterns
- Build prompt template with:
  - System role
  - Output constraints
  - Design token injection
- Generate final prompt string from config

## Acceptance Criteria
- Same config always generates same prompt
- Prompt is human-readable
- No free-form user text yet
