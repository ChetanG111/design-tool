export let isFirstPrompt = true;
export let currentCode = '';
export let currentMode = 'design'; // 'design' or 'edit'
export let selectedElementTag = '';

// Builder selections
export let builderSelections: Record<string, any> = {
    'layout-type': 'hero',
    'layout-config': 'left-text',
    'platform': 'web',
    'style': 'flat',
    'accent-color': 'brand',
    'anim-type': 'fade',
    'anim-scene': 'staggered',
    'anim-duration': 0.5,
    'anim-delay': 0,
    'theme': 'dark'
};

export function setFirstPrompt(val: boolean) { isFirstPrompt = val; }
export function setCurrentCode(val: string) { currentCode = val; }
export function setCurrentMode(val: string) { currentMode = val; }
export function setSelectedElementTag(val: string) { selectedElementTag = val; }

export function updateBuilderSelection(category: string, value: any) {
    builderSelections[category] = value;
}
