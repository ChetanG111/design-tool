# Constraints & Non-Goals

## Current Constraints
- **Output Format**: The app produces only a single-file `index.html`.
- **Logic**: Generation is currently based on static template string interpolation.
- **Persistence**: Selections are held in React state; there is no database persistence or session recovery.
- **Responsiveness**: The workspace is optimized for desktop usage during the current phase.

## Non-Goals (V1)
- **No AI Interference**: No dynamic generation via LLMs or automated design scoring.
- **No Free-form Editing**: Drag-and-drop or granular CSS editing is explicitly excluded.
- **No Multi-page Support**: The tool is strictly for single-page landing pages.
- **No Image Hosting**: Users are responsible for external image assets.
