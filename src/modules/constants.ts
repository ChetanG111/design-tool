export const DESIGN_SYSTEM_INSTRUCTIONS = `
STRICT RULES:
1. USE ONLY HTML AND TAILWIND CSS.
2. NO EXTERNAL CSS OR INTERNAL <style> TAGS (except Google Font imports).
3. NO GRADIENTS WHATSOEVER unless explicitly requested in the prompt. Use solid colors, subtle borders, and clean whitespace.
4. USE TAILWIND PLAY CDN: <script src="https://cdn.tailwindcss.com"></script>
5. ARCHITECTURE: Build a complete, responsive landing page.
6. AESTHETICS: Modern, premium, minimalist. Use large font sizes for headings, optimal line heights, and generous padding/margin.
7. INTERACTION: Add subtle Tailwind hover transitions to buttons and links while keeping the texts visible
`;

export const DESIGN_MODE_SCRIPT = `
    <script>
        let isDesignMode = false;
        window.addEventListener('message', (e) => {
            if (e.data.type === 'toggle-design-mode') {
                isDesignMode = e.data.enabled;
                document.body.style.cursor = isDesignMode ? 'crosshair' : 'default';
            }
        });

        document.body.addEventListener('mouseover', (e) => {
            if (!isDesignMode) return;
            const el = e.target;
            el.style.transition = 'outline 0.1s ease';
            el.style.outline = '2px solid #6366f1';
            el.style.outlineOffset = '2px';
            
            let tooltip = document.getElementById('aura-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'aura-tooltip';
                tooltip.style.cssText = 'position:fixed; background:#6366f1; color:white; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; font-family:sans-serif; z-index:99999; pointer-events:none; box-shadow:0 4px 12px rgba(99,102,241,0.3);';
                document.body.appendChild(tooltip);
            }
            tooltip.textContent = '<' + el.tagName.toLowerCase() + '>';
            const rect = el.getBoundingClientRect();
            tooltip.style.top = Math.max(0, rect.top - 35) + 'px';
            tooltip.style.left = rect.left + 'px';
            tooltip.style.display = 'block';
        });

        document.body.addEventListener('mouseout', (e) => {
            e.target.style.outline = 'none';
            const tooltip = document.getElementById('aura-tooltip');
            if (tooltip) tooltip.style.display = 'none';
        });

        document.body.addEventListener('dblclick', (e) => {
            if (!isDesignMode) return;
            e.preventDefault();
            const tag = e.target.tagName.toLowerCase();
            window.parent.postMessage({ type: 'element-selected', tag: tag }, '*');
        });
    </script>
`;
