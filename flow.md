# System Flow

1. User selects layout + style + animation in UI
2. State object is updated (designConfig)
3. Prompt Orchestrator converts state → super-prompt
4. LLM streams React + Tailwind code
5. Code is sanitized and stored
6. Preview engine renders code live
7. User clicks DOM node
8. System extracts node + code context
9. Sub-prompt is generated for targeted edit
10. LLM returns modified snippet
11. Snippet replaces original code
12. Preview re-renders

Key Principle:
Full regeneration is the fallback. Scoped regeneration is the default.
