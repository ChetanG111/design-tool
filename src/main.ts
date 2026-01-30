// Live Reload
const eventSource = new EventSource('/hot-reload');
eventSource.onmessage = (event) => {
    if (event.data === 'reload') {
        console.log("File change detected, reloading...");
        window.location.reload();
    }
};

// State Management
let isFirstPrompt = true;
let currentCode = '';
let currentMode = 'design'; // 'design' or 'edit'
let selectedElementTag = '';

// Elements
const app = document.getElementById('app')!;
const topBar = document.getElementById('top-bar')!;
const chatHeader = document.getElementById('chat-header')!;
const chatMessages = document.getElementById('chat-messages')!;
const previewContainer = document.getElementById('preview-container')!;
const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
const sendBtn = document.getElementById('send-btn')!;
const promptBuilderBtn = document.getElementById('prompt-builder-btn')!;
const promptBuilderPanel = document.getElementById('prompt-builder-panel')!;
const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
const codeView = document.getElementById('code-view')!;
const codeContent = document.getElementById('code-content')!;
const modalBackdrop = document.getElementById('modal-backdrop')!;
const closeBuilderBtn = document.getElementById('close-builder-btn')!;

// Builder selections
let builderSelections: Record<string, string> = {
    'layout-type': 'hero',
    'layout-config': 'card',
    'framing': 'full-screen',
    'style': 'flat',
    'theme': 'dark',
    'platform': 'web'
};

// Initialize
function init() {
    setupEventListeners();
    initCustomSelects();
}

function initCustomSelects() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.dataset.enhanced) return;
        select.dataset.enhanced = "true";

        const container = document.createElement('div');
        container.className = 'custom-select';

        const trigger = document.createElement('div');
        trigger.className = 'select-trigger';

        const selectedText = document.createElement('span');
        selectedText.textContent = select.options[select.selectedIndex]?.text || 'Select...';

        const icon = document.createElement('div');
        icon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;

        trigger.appendChild(selectedText);
        trigger.appendChild(icon);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'select-options';

        Array.from(select.options).forEach((opt, idx) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            if (idx === select.selectedIndex) optionEl.classList.add('selected');
            optionEl.textContent = opt.text;
            optionEl.dataset.value = opt.value;

            optionEl.addEventListener('click', () => {
                select.value = opt.value;
                selectedText.textContent = opt.text;

                // Update selected class
                optionsContainer.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                optionEl.classList.add('selected');

                container.classList.remove('active');

                // Trigger native change event
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });

            optionsContainer.appendChild(optionEl);
        });

        container.appendChild(trigger);
        container.appendChild(optionsContainer);

        // Wrap the original select
        select.parentNode?.insertBefore(container, select);
        container.appendChild(select); // The select is now inside and hidden via CSS

        if (select.closest('.input-actions')) {
            container.classList.add('open-top');
        }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other selects
            document.querySelectorAll('.custom-select').forEach(s => {
                if (s !== container) s.classList.remove('active');
            });
            container.classList.toggle('active');
        });
    });

    // Global click listener to close dropdowns
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('active'));
    });
}

function setupEventListeners() {
    sendBtn.addEventListener('click', handleSend);
    promptBuilderBtn.addEventListener('click', () => {
        const isHidden = promptBuilderPanel.classList.toggle('hidden');
        modalBackdrop.classList.toggle('hidden', isHidden);
    });

    modalBackdrop.addEventListener('click', () => {
        promptBuilderPanel.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
    });

    closeBuilderBtn.addEventListener('click', () => {
        promptBuilderPanel.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
    });

    // Builder Card Clicks
    document.querySelectorAll('.builder-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = (card.parentElement as HTMLElement).dataset.category;
            if (!category) return;

            // Update selection
            builderSelections[category] = (card as HTMLElement).dataset.value!;

            // Update UI
            card.parentElement?.querySelectorAll('.builder-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Platform Toggle
    document.querySelectorAll('#platform-toggle .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#platform-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            builderSelections['platform'] = (btn as HTMLElement).dataset.value!;
        });
    });

    // Collapsible sections
    document.querySelectorAll('.builder-category.collapsible .trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            trigger.parentElement?.classList.toggle('collapsed');
        });
    });

    // Back Button
    document.getElementById('back-btn')?.addEventListener('click', () => {
        app.classList.remove('split-mode');
        app.classList.add('entry-mode');
        topBar.classList.add('hidden');
        isFirstPrompt = true;
        chatMessages.innerHTML = '';
        currentCode = '';
        updatePreview('');
    });

    // Add to Prompt Button
    document.getElementById('add-to-prompt-btn')?.addEventListener('click', () => {
        const context = constructBuilderContext();
        const existing = promptInput.value.trim();
        const newValue = existing
            ? `${context}\n\nAdditional Instructions: ${existing}`
            : context;

        promptInput.value = newValue;

        // Log the final prompt that will be sent to the terminal
        const finalPrompt = constructPrompt(newValue);
        fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `FINAL PROMPT PREVIEW:\n${finalPrompt}` })
        });

        promptBuilderPanel.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
        promptInput.focus();
        promptInput.scrollTop = promptInput.scrollHeight;
    });

    // Export Button
    document.getElementById('export-btn')?.addEventListener('click', () => {
        const blob = new Blob([currentCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'design.html';
        a.click();
    });

    // View Switchers
    document.querySelectorAll('.view-switchers .switcher-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const view = target.dataset.view;
            updateViewType(view!);
            document.querySelectorAll('.view-switchers .switcher-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Mode Switchers
    document.querySelectorAll('.mode-switchers .switcher-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const mode = target.dataset.view;
            updatePreviewMode(mode!);
            document.querySelectorAll('.mode-switchers .switcher-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Handle messages from iframe (Design Mode selection)
    window.addEventListener('message', (event) => {
        if (event.data.type === 'element-selected') {
            selectedElementTag = event.data.tag;
            promptInput.value = `Edit this element (${selectedElementTag}): `;
            promptInput.focus();
            switchToEditMode();
        }
    });
}

function switchToEditMode() {
    currentMode = 'edit';
    const select = document.getElementById('inline-mode-select') as HTMLSelectElement;
    if (select) {
        select.value = 'edit';
        // Update custom trigger text if it exists
        const triggerText = select.closest('.custom-select')?.querySelector('.select-trigger span');
        if (triggerText) triggerText.textContent = 'Edit Mode';
        // Update selected class in custom options
        const options = select.closest('.custom-select')?.querySelectorAll('.option');
        options?.forEach(opt => {
            opt.classList.toggle('selected', (opt as HTMLElement).dataset.value === 'edit');
        });
    }
    promptInput.placeholder = "Tell me what to edit...";
}

async function handleSend() {
    const prompt = promptInput.value.trim();
    if (!prompt && !builderSelections['layout-type']) return;

    const fullPrompt = constructPrompt(prompt);
    const modelInput = document.getElementById('inline-model-select') as HTMLSelectElement;
    const model = modelInput ? modelInput.value : 'gemini-2.0-flash';

    if (isFirstPrompt) {
        switchToSplitMode();
        isFirstPrompt = false;
    }

    addMessage('user', prompt || 'Generating design...');
    promptInput.value = '';

    const assistantMsgId = addMessage('assistant', 'Designing your landing page...');

    try {
        const designSystemInstructions = `
STRICT RULES:
1. USE ONLY HTML AND TAILWIND CSS.
2. NO EXTERNAL CSS OR INTERNAL <style> TAGS (except Google Font imports).
3. NO GRADIENTS WHATSOEVER unless explicitly requested in the prompt. Use solid colors, subtle borders, and clean whitespace.
4. USE TAILWIND PLAY CDN: <script src="https://cdn.tailwindcss.com"></script>
5. ARCHITECTURE: Build a complete, responsive landing page.
6. AESTHETICS: Modern, premium, minimalist. Use large font sizes for headings, optimal line heights, and generous padding/margin.
7. INTERACTION: Add subtle Tailwind hover transitions to buttons and links while keeping the texts visible
`;

        const layoutType = builderSelections['layout-type'] || 'landing-page';
        const systemPrompt = currentMode === 'edit'
            ? `You are an expert editor. Modify the existing code according to user instructions.${designSystemInstructions} Return ONLY the complete updated HTML document. Existing Code: \n${currentCode}`
            : `You are an expert web designer. ${designSystemInstructions} Page Type: {${layoutType}}. Layout Config: ${builderSelections['layout-config'] || 'card'}. Framing: ${builderSelections['framing'] || 'full-screen'}. Style: ${builderSelections['style'] || 'flat'}. Theme: ${builderSelections['theme'] || 'dark'}. Create a stunning, high-converting ${layoutType.replace('-', ' ')} for ${builderSelections['platform'] || 'web'}. Return ONLY valid HTML.`;

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

        currentCode = code;
        updatePreview(code);
        removeMessage(assistantMsgId);
        addMessage('assistant', currentMode === 'edit' ? 'Edits applied!' : 'Design generated!');
    } catch (error) {
        console.error(error);
        removeMessage(assistantMsgId);
        addMessage('assistant', 'Error: Failed to reach the AI model.');
    }
}

function constructBuilderContext() {
    let context = '';
    if (builderSelections['layout-type']) context += `Page Type: {${builderSelections['layout-type']}}. `;
    if (builderSelections['platform']) context += `Target Device: ${builderSelections['platform']}. `;
    if (builderSelections['layout-config']) context += `Layout Config: ${builderSelections['layout-config']}. `;
    if (builderSelections['framing']) context += `Framing: ${builderSelections['framing']}. `;
    if (builderSelections['style']) context += `Design Style: ${builderSelections['style']}. `;
    if (builderSelections['theme']) context += `Theme: ${builderSelections['theme']} mode. `;
    return context.trim();
}

function constructPrompt(userPrompt: string) {
    if (currentMode === 'edit') return userPrompt;
    const builderContext = constructBuilderContext();
    return `${builderContext} ${userPrompt}`.trim();
}

function switchToSplitMode() {
    app.classList.remove('entry-mode');
    app.classList.add('split-mode');
    topBar.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    chatMessages.classList.remove('hidden');
    previewContainer.classList.remove('hidden');
    promptBuilderBtn.classList.add('hidden');
    promptBuilderPanel.classList.add('hidden');
}

function updatePreview(code: string) {
    if (!code) {
        previewFrame.src = 'about:blank';
        codeContent.textContent = '';
        return;
    }
    // Inject design mode script into the code
    const designScript = `
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

    const finalCode = code.includes('</body>')
        ? code.replace('</body>', designScript + '</body>')
        : code + designScript;

    const blob = new Blob([finalCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    codeContent.textContent = code;
}

function injectStyle(css: string) {
    if (!currentCode) return;
    if (currentCode.includes('</style>')) {
        currentCode = currentCode.replace('</style>', `${css}\n</style>`);
    } else if (currentCode.includes('</head>')) {
        currentCode = currentCode.replace('</head>', `<style>${css}</style>\n</head>`);
    } else {
        currentCode += `<style>${css}</style>`;
    }
    updatePreview(currentCode);
}

function updateViewType(view: string) {
    if (view === 'mobile') {
        previewFrame.style.width = '375px';
        previewFrame.style.margin = '20px auto';
        previewFrame.style.height = 'calc(100% - 40px)';
        previewFrame.style.border = '12px solid #222';
        previewFrame.style.borderRadius = '32px';
    } else {
        previewFrame.style.width = '100%';
        previewFrame.style.margin = '0';
        previewFrame.style.height = '100%';
        previewFrame.style.border = 'none';
        previewFrame.style.borderRadius = '12px';
    }
}

function updatePreviewMode(mode: string) {
    codeView.classList.toggle('hidden', mode !== 'code');

    // Notify iframe about design mode
    previewFrame.contentWindow?.postMessage({
        type: 'toggle-design-mode',
        enabled: mode === 'design'
    }, '*');
}

function addMessage(role: string, text: string) {
    const id = Date.now().toString();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.id = id;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeMessage(id: string) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

document.addEventListener('DOMContentLoaded', init);
