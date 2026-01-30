import { DesignConfig } from '../store/useDesignStore'

export const SYSTEM_ROLE = `You are a world-class Frontend Engineer and UI/UX Designer. 
Your task is to generate premium, high-fidelity React components using ONLY Tailwind CSS.
You produce clean, functional, and aesthetically pleasing code.`

export const OUTPUT_CONSTRAINTS = `
- Output ONLY valid TypeScript/JSX.
- Do NOT include markdown code blocks.
- Use Tailwind CSS for all styling.
- Ensure the component is responsive.
- Do NOT use external libraries other than Lucide React for icons.
- The component MUST be exported as 'export default function Component()'.
- Do NOT include any explanations or commentary.

- CRITICAL: Use ONLY the provided design tokens for colors, fonts, shadows, and radii. 
- DO NOT invent new color shades (e.g., if primary is indigo-600, do not use indigo-400 unless specifically requested).
- If a token is not provided, use standard Tailwind classes but prioritize the design system.
`

export function generateSuperPrompt(config: DesignConfig): string {
    const { layout, style, theme, animation, tokens } = config

    return `
--- SYSTEM INSTRUCTION ---
${SYSTEM_ROLE}
${OUTPUT_CONSTRAINTS}

--- DESIGN CONFIGURATION ---
LAYOUT TYPE: ${layout.toUpperCase()}
DESIGN STYLE: ${style.toUpperCase()}
THEME: ${theme.toUpperCase()}
ANIMATION TYPE: ${animation.toUpperCase()}

--- DESIGN TOKENS (STRICT ENFORCEMENT) ---
FONT FAMILY: ${tokens.font}
PRIMARY COLOR: ${tokens.primaryColor}
SECONDARY COLOR: ${tokens.secondaryColor}
SHADOW STRENGTH: ${tokens.shadow}
BORDER RADIUS: ${tokens.borderRadius}

--- TASK ---
Build a premium ${layout} component in a ${style} style using a ${theme} theme.
The primary color is ${tokens.primaryColor} and the secondary color is ${tokens.secondaryColor}.
Use ${tokens.font} as the primary font (assume it is available).
Apply ${tokens.shadow} shadows and ${tokens.borderRadius} border radii globally.
Implement ${animation} entrance animations.

--- STYLE GUIDE ---
${getStyleGuide(style, theme, tokens)}

FINAL WORD: Your output must be a single file containing a complete, self-contained React component. No extra text.
`
}

function getStyleGuide(style: string, theme: string, tokens: any): string {
    const isDark = theme === 'dark'
    const bgColor = isDark ? 'bg-slate-950' : 'bg-white'
    const textColor = isDark ? 'text-white' : 'text-slate-900'

    let guide = `- Base Background: ${bgColor}
- Base Text: ${textColor}
- Accent: ${tokens.primaryColor}
`

    if (style === 'glass') {
        guide += `- Use backdrop-blur-md, saturate-150, and border-white/10 (or border-black/10 for light mode).
- Apply subtle gradients for depth.
- High transparency on surface backgrounds.`
    } else if (style === 'minimal') {
        guide += `- Extreme whitespace.
- Thin borders (1px).
- Zero gradients.
- Typography-centered design.`
    } else if (style === 'brutal') {
        guide += `- Bold black borders (2px+).
- High contrast.
- Harsh shadows (no blur).
- Unusual positioning.`
    }

    return guide
}
