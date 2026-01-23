---
trigger: model_decision
description: This rule applies whenever the AI agent works inside this repository. It defines the project’s purpose, folder responsibilities, tech stack, workflows, coding standards, and operational constraints so the agent can act autonomously and safely.
---

# Project Rules and Agent Operating Guide

## Purpose of This File
This file is the single source of truth for how this project is structured and how an AI agent must behave inside it.  
The agent must read and follow this file before creating, modifying, or deleting any code, config, or documentation.

This file explains:
- What the project is about
- What each folder and file represents
- Which technologies are allowed
- How workflows, APIs, and data boundaries work
- What the agent is allowed and not allowed to do

If anything here conflicts with other files, **this file wins** unless explicitly stated otherwise.

---

## Project Overview
This application is a production-grade product built with AI-assisted development.  
The agent’s role is to extend, refactor, debug, and document the system while preserving architectural intent, security, and maintainability.

The agent must behave like a senior engineer, not a code generator.

---

## Repository Structure
The agent must respect folder boundaries strictly.

### `/src`
Core application source code.
- Contains business logic, services, and domain models
- No experimental or throwaway code allowed
- Changes here must be deliberate and minimal

### `/api`
API layer.
- Route definitions, controllers, request validation
- Must not contain business logic
- Must follow existing API contracts

### `/services`
Reusable services and integrations.
- External APIs, AI providers, databases, queues
- Must be stateless unless explicitly designed otherwise

### `/config`
Configuration files only.
- Environment-specific values
- No secrets hardcoded
- Agent must never invent config values

### `/docs`
Human-facing documentation.
- Architecture explanations
- API specs
- Design decisions
- Clean readable .md format
The agent may update/create docs only when code behavior changes.

### `/tests`
Automated tests.
- Unit, integration, or e2e
- Agent must add or update tests when changing behavior

### `/scripts`
Tooling and automation.
- Migrations, setup, maintenance scripts
- Must be idempotent where possible

---

## Tech Stack Rules
The agent must only use technologies already present in the project unless explicitly instructed otherwise.

- No framework switching
- No unnecessary dependencies
- Prefer existing utilities over new abstractions
- Consistency beats novelty

If unsure, **do nothing and ask** rather than guessing.

---

## Coding Standards
- Match existing code style exactly
- No unexplained magic numbers
- No commented-out code
- Clear, boring names over clever ones
- Functions do one thing or they’re lying
- Follow K.I.S.S Principle everywhere before implementing anything

The agent must refactor only when necessary to support the change.

---

## API Rules
- Do not break existing API contracts
- Do not rename fields without migration strategy
- Validate all external input
- Never trust client data
- Errors must be explicit and structured

Backward compatibility is mandatory unless explicitly waived.

---

## Data and State Management
- Do not introduce shared mutable state casually
- Side effects must be explicit
- Database access must go through approved layers
- Never bypass validation or authorization

If data flow is unclear, stop and inspect before acting.

---

## AI-Specific Behavior Rules
- The agent must not hallucinate files, APIs, or configs
- The agent must not assume undocumented behavior
- The agent must search the repo before making claims
- The agent must explain *why* a change is needed when making one

If confidence is low, the agent must surface uncertainty.

---

## Workflow Expectations
When making changes, the agent must:
1. Understand the intent of the existing code
2. Identify the smallest correct change
3. Update related tests and docs if needed
4. Avoid scope creep
5. Leave the codebase cleaner than before

No drive-by refactors. No “while I’m here” behavior.

---

## Prohibited Actions
The agent must NOT:
- Introduce breaking changes silently
- Add dependencies without justification
- Remove files without understanding their usage
- Expose secrets, keys, or credentials
- Optimize prematurely

Violating these rules is considered a failure.

---

## Final Principle
This project values **clarity, stability, and intent** over cleverness.

If a decision trades long-term sanity for short-term speed, the agent must choose sanity.
