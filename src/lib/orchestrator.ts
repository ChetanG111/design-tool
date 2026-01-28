export interface DesignConfig {
    layout: string;
    style: string;
    theme: string;
    animation: string;
}

const LAYOUT_MAPPINGS: Record<string, string> = {
    'hero-section': 'A high-impact landing page hero section with a clear H1, subtext, and primary CTA button.',
    'features': 'A multi-column grid section showcasing key product features with icons, titles, and descriptions.',
    'pricing': 'A clean pricing comparison table with different tiers, highlighting the most popular option.',
    'contact': 'A professional contact form with input fields for name, email, and message, including a submit button.'
};

const STYLE_MAPPINGS: Record<string, string> = {
    'modern': 'Use bold typography, ample whitespace, and high-contrast color pairings. Incorporate subtle shadows and rounded corners (rounded-2xl).',
    'minimal': 'Focus on extreme simplicity. Use hairline borders (border-neutral-800), monochromatic colors, and tight typography. No shadows.',
    'glassmorphism': 'Use semi-transparent backgrounds (bg-white/5), heavy backdrop blur (backdrop-blur-xl), and iridescent border-glows. Maintain a futuristic aesthetic.',
    'playful': 'Use vibrant accent colors, bouncy animations, and large organic border radii (rounded-[2rem]). Typography should be friendly and rounded.'
};

export function generateSuperPrompt(config: DesignConfig): string {
    const layoutDesc = LAYOUT_MAPPINGS[config.layout] || 'A generic UI section.';
    const styleDesc = STYLE_MAPPINGS[config.style] || 'Standard modern UI.';

    return `
You are an expert Frontend Engineer and UI/UX Designer. Generate a production-ready React component using Tailwind CSS.

### OBJECTIVE
Build a ${config.layout.replace('-', ' ')} with a ${config.style} aesthetic.

### DESIGN REQUIREMENTS
- Layout: ${layoutDesc}
- Style: ${styleDesc}
- Theme: ${config.theme} mode usage only.
- Animation: ${config.animation} transitions using Framer Motion if applicable.

### TECHNICAL CONSTRAINTS
- Use React (functional components).
- Use Tailwind CSS for all styling (do not use arbitrary values unless necessary).
- Use Lucide-React for icons.
- Use Framer Motion for animations.
- The component must be self-contained in a single default export function called 'Preview'.
- DO NOT use any external image URLs unless they are from Unsplash (via https://images.unsplash.com/...).
- RETURN ONLY THE CODE. NO MARKDOWN FENCES. NO EXPLANATIONS.

### COMPONENT STRUCTURE
- Container should have transition properties for smooth entry.
- Ensure responsiveness (mobile-first).

Ready? Generate the 'Preview' component now.
`.trim();
}
