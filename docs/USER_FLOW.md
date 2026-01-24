# User Flow

The application follows a strict linear selector flow managed via the `/workspace` route.

## Step-by-Step Path

1. **App Entry**: User lands on the hero page and enters the workspace.
2. **Step 1: Intent (`/workspace/project`)**: User selects the primary purpose or theme of the landing page.
3. **Step 2: Theme (`/workspace/assets`)**: User selects the primary accent color.
4. **Step 3: Layout (`/workspace/canvas`)**: User chooses the navigation bar style (e.g., Slim vs Floating).
5. **Real-time Preview**: Each selection updates the `DesignContext`, which is reflected immediately in the `PreviewPane` on the right side of the dashboard.
6. **Finalization**: User navigates to the export step to trigger the HTML generation.
