# Aura.build – Local Light Version Overview

## Goal
Build a local Generative Design-to-Code Orchestrator that converts structured UI state into production-ready frontend code using an LLM, with real-time preview and targeted regeneration.

## Core Idea
The system is not a chat UI. It is a state-driven generator where:
- UI selections → structured config
- Config → deterministic prompt
- Prompt → LLM-generated code
- Code → live preview
- User edits → scoped regeneration (not full reruns)

## Non-Goals
- No full Figma import
- No backend persistence
- No auth or billing
- No multi-page routing

## Core Constraints
- Tailwind-first output
- React-compatible code only
- All LLM calls must be prompt-templated
- Regeneration must be scoped when possible
