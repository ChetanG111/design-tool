# Aura.build — Exact Recreation Specification

## Role and Operating Mode

You are a senior full-stack engineer and AI systems architect.

Your task is to **EXACTLY RECREATE** the product demonstrated in a reference video, based solely on the specification below.

### Hard Constraints

- You MUST NOT simplify, redesign, or reinterpret functionality
- You MUST NOT introduce new UX patterns
- You MUST NOT change layout, interaction flow, or system behavior
- You MUST NOT one-shot the build

This is a **mechanical reconstruction**, not an interpretation.

---

## Product Identity

### Name
Aura.build (Local Light Version)

### Category
Generative Design-to-Code Orchestrator

### Definition
A state-driven UI system that converts structured UI/UX selections into deterministic LLM prompts, generates frontend code, renders it live, and supports bi-directional, scoped regeneration between rendered UI and source code.

**This is NOT:**
- A chat interface
- A prompt playground
- A website builder
- A one-shot generator

If the system behaves like ChatGPT with UI chrome, it is incorrect.

---

## Global UX / Layout Requirements

The application MUST render **three panes simultaneously**:

### Left Pane — Design Controls

- Layout selector (Hero, Section, Card, etc.)
- Style selector (Glass, Solid, Minimal)
- Theme selector (Light, Dark)
- Animation selector (Slide, Fade)
- Design token overrides:
  - Font
  - Primary color
  - Shadow

All controls mutate a shared configuration object.  
**There is NO free-text prompt input.**

### Center Pane — Live Preview

- Renders generated UI immediately
- Uses Tailwind CSS
- Supports hover highlighting
- Supports click-to-select elements
- Displays visual selection state

### Right Pane — Code Editor

- Monaco Editor
- Displays generated React + Tailwind code
- Always synced with preview
- Reflects partial code updates when scoped regeneration occurs

**All three panes are always visible.**

---

## Core Architecture Modules

### 1. Prompt Orchestrator (State → Prompt)

#### Input
A structured configuration object:

```json
{
  "layout": "hero",
  "style": "glass",
  "theme": "dark",
  "animation": "slide",
  "tokens": {
    "font": "Geist",
    "primaryColor": "indigo-500",
    "shadow": "lg"
  }
}
```

#### Behavior

- Convert state into a deterministic, human-readable super-prompt
- Inject system role and output constraints
- Enforce design tokens
- Produce identical prompts for identical state
- No randomness. No creative freedom.

### 2. LLM Generation Layer

#### Responsibilities

- Stream React + Tailwind code
- No markdown in final output
- JSX must be valid
- Output treated as untrusted text

#### Forbidden

- Multi-file output
- CSS files
- Non-React frameworks

### 3. Code Sandbox / Preview Engine

#### Requirements

- Parse and sanitize LLM output
- Render in isolation (iframe or dynamic loader)
- Inject Tailwind via CDN
- Fail gracefully on errors
- Re-render immediately on change
- Client-side only. No SSR.

### 4. Bi-Directional Inspector (CRITICAL)

#### Capabilities

- Hover detection on preview elements
- Click-to-select DOM nodes
- Map DOM node → source JSX
- Extract minimal JSX snippet

#### Edit Flow

1. User selects element
2. User requests edit (text/style)
3. System generates contextual sub-prompt
4. Sub-prompt includes ONLY selected JSX
5. LLM instructed to preserve everything else
6. Only the snippet is replaced
7. Preview updates

**Full regeneration is a fallback only.**

### 5. Design System Bridge

#### Tokens

- Fonts
- Colors
- Shadows
- (Optional) spacing

#### Enforcement

- Tokens are user-controlled
- Tokens override LLM decisions
- Tokens injected into ALL prompts
- LLM forbidden from inventing new tokens
- Token violations are errors

---

## Tech Stack (Mandatory)

- **Framework:** Next.js OR Vite + React
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Code Editor:** Monaco Editor
- **LLM Interface:** Vercel AI SDK OR LangChain
- **Model:** GPT-4o OR Gemini 1.5

Generated code MUST be React + Tailwind only.

---

## Execution Model (Strict Step Flow)

You MUST proceed in incremental steps.

**For EACH step:**

1. Implement exactly ONE subsystem
2. Stop execution
3. Review your own code
4. Explain:
   - What was implemented
   - Assumptions made
   - What is deferred
5. Continue only after self-review

**You MUST NOT ask the user for approval.**

---

## Build Order (Non-Negotiable)

1. Project setup + three-pane layout
2. Zustand state + configuration schema
3. Prompt orchestrator
4. LLM streaming + sanitation
5. Live preview engine
6. DOM inspector + node mapping
7. Contextual sub-prompting
8. Design token enforcement
9. Stability, retries, and guardrails

Each step must leave the app runnable.

---

## Success Criteria

The system is complete ONLY IF:

- UI state deterministically produces prompts
- Generated code renders live
- Elements can be edited via scoped regeneration
- The system behaves like a design instrument, not a chatbot

---

## Start Instruction

**Begin with Step 1 only:**

- Project setup
- Three-pane layout
- Base Zustand wiring

**Do NOT:**

- Jump ahead
- Summarize future steps
- Optimize prematurely

**Build. Stop. Review. Continue.**
