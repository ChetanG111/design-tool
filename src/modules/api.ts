import { builderSelections, currentMode, currentCode, setCurrentCode, setFirstPrompt, isFirstPrompt } from './state';
import { DESIGN_SYSTEM_INSTRUCTIONS } from './constants';
import { addMessage, removeMessage, updatePreview, switchToSplitMode } from './ui';
import { promptInput, inlineModelSelect } from './elements';

export function constructBuilderContext() {
    let context = '';
    if (builderSelections['layout-type']) context += `Page Type: {${builderSelections['layout-type']}}. `;
    if (builderSelections['platform']) context += `Target Device: ${builderSelections['platform']}. `;
    if (builderSelections['layout-config']) context += `Layout Config: ${builderSelections['layout-config']}. `;
    if (builderSelections['style']) context += `Design Style: ${builderSelections['style']}. `;
    if (builderSelections['accent-color']) context += `Accent Color: ${builderSelections['accent-color']}. `;
    if (builderSelections['theme']) context += `Theme: ${builderSelections['theme']} mode. `;
    if (builderSelections['anim-type']) {
        context += `Element Animation: ${builderSelections['anim-type']} style. `;
        context += `Scene Animation: ${builderSelections['anim-scene'] || 'staggered'} mode. `;
        context += `Animation Timing: ${builderSelections['anim-duration']}s duration, ${builderSelections['anim-delay']}s delay. `;
    }
    return context.trim();
}

export function constructPrompt(userPrompt: string) {
    if (currentMode === 'edit') return userPrompt;
    const builderContext = constructBuilderContext();
    return `${builderContext} ${userPrompt}`.trim();
}

export async function handleSend() {
    const prompt = promptInput.value.trim();
    if (!prompt && !builderSelections['layout-type']) return;

    const fullPrompt = constructPrompt(prompt);
    const model = inlineModelSelect ? inlineModelSelect.value : 'gemini';

    if (isFirstPrompt) {
        switchToSplitMode();
        setFirstPrompt(false);
    }

    addMessage('user', prompt || 'Generating design...');
    promptInput.value = '';

    const assistantMsgId = addMessage('assistant', 'Designing your landing page...');

    try {
        const layoutType = builderSelections['layout-type'] || 'landing-page';
        const systemPrompt = currentMode === 'edit'
            ? `You are an expert editor. Modify the existing code according to user instructions.${DESIGN_SYSTEM_INSTRUCTIONS} Return ONLY the complete updated HTML document. Existing Code: \n${currentCode}`
            : `You are an expert web designer. ${DESIGN_SYSTEM_INSTRUCTIONS} Page Type: {${layoutType}}. Layout Config: ${builderSelections['layout-config'] || 'card'}. Framing: ${builderSelections['framing'] || 'full-screen'}. Style: ${builderSelections['style'] || 'flat'}. Theme: ${builderSelections['theme'] || 'dark'}. Create a stunning, high-converting ${layoutType.replace('-', ' ')} for ${builderSelections['platform'] || 'web'}. Return ONLY valid HTML.`;

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: fullPrompt,
                systemPrompt
            })
        });

        const result = (await response.json()) as any;
        let code = result.choices?.[0]?.message?.content || "Error generating code.";
        code = code.replace(/```html/g, '').replace(/```/g, '').trim();

        setCurrentCode(code);
        updatePreview(code);
        removeMessage(assistantMsgId);
        addMessage('assistant', currentMode === 'edit' ? 'Edits applied!' : 'Design generated!');
    } catch (error) {
        console.error(error);
        removeMessage(assistantMsgId);
        addMessage('assistant', 'Error: Failed to reach the AI model.');
    }
}
