# Technical Architecture

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Styling**: Vanilla CSS Modules
- **State Management**: React Context (`DesignContext`)

## Folder Ownership & structure

- `src/app/`: Handles routing and page-level layout.
    - `/workspace`: The primary application environment.
- `src/layout/`: Global UI components including `Sidebar` and `DashboardLayout`.
- `src/steps/`: Individual selection components (Intent, Accent Color, Navbar).
- `src/context/`: `DesignContext.tsx` handles the global state of user selections.
- `src/preview/`: `PreviewPane` for visual feedback and `OutputModal` for generation results.
- `src/routes/`: Centralized configuration for the step-based navigation (`STEPS`).
- `planning/`: Design assets and mockups used for reference during development.
