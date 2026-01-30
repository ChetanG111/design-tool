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

// Builder Inputs
const builderLayout = document.getElementById('builder-layout') as HTMLSelectElement;
const builderNavbar = document.getElementById('builder-navbar') as HTMLSelectElement;
const builderFont = document.getElementById('builder-font') as HTMLSelectElement;
const builderAnimType = document.getElementById('builder-anim-type') as HTMLSelectElement;
const builderAnimDuration = document.getElementById('builder-anim-duration') as HTMLInputElement;
const builderAnimDelay = document.getElementById('builder-anim-delay') as HTMLInputElement;
const builderAnimScene = document.getElementById('builder-anim-scene') as HTMLSelectElement;
const builderAnimDirection = document.getElementById('builder-anim-direction') as HTMLSelectElement;
const builderAnimTiming = document.getElementById('builder-anim-timing') as HTMLSelectElement;
const builderColorMode = document.getElementById('builder-color-mode') as HTMLSelectElement;
const builderAccentColor = document.getElementById('builder-accent-color') as HTMLSelectElement;

// Initialize
function init() {
    setupEventListeners();
    initCustomSelects();
}

function initCustomSelects() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.closest('.dropdown-content')) return; // Skip top bar tool selects if any
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
    promptBuilderBtn.addEventListener('click', () => promptBuilderPanel.classList.toggle('hidden'));

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
        if (existing) {
            promptInput.value = `${context}\n\nAdditional Instructions: ${existing}`;
        } else {
            promptInput.value = context;
        }
        promptBuilderPanel.classList.add('hidden');
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

    // Chat Mode Toggle (Design vs Edit) via dropdown
    const inlineModeSelect = document.getElementById('inline-mode-select') as HTMLSelectElement;
    inlineModeSelect?.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        currentMode = target.value;

        if (currentMode === 'edit') {
            promptInput.placeholder = "Tell me what to edit...";
        } else {
            promptInput.placeholder = "Describe a new design...";
        }
    });

    // Top Bar Injections
    document.querySelectorAll('[data-font]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const font = (e.target as HTMLButtonElement).dataset.font;
            injectStyle(`body { font-family: '${font}', sans-serif !important; }`);
        });
    });

    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = (e.target as HTMLButtonElement).dataset.theme;
            const color = theme === 'dark' ? '#0a0a0a' : '#ffffff';
            const textColor = theme === 'dark' ? '#ffffff' : '#0a0a0a';
            injectStyle(`body { background-color: ${color} !important; color: ${textColor} !important; }`);
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
    if (!prompt && !builderLayout.value) return;

    const fullPrompt = constructPrompt(prompt);
    const model = (document.getElementById('inline-model-select') as HTMLSelectElement).value;

    if (isFirstPrompt) {
        switchToSplitMode();
        isFirstPrompt = false;
    }

    addMessage('user', prompt || "Designing based on template selections...");
    promptInput.value = '';

    const loadingId = addMessage('assistant', 'Processing request...');

    try {
        const systemPrompt = currentMode === 'edit'
            ? `You are an expert editor. Modify the existing code according to user instructions. Return ONLY the complete updated HTML. Existing Code: \n${currentCode}`
            : `You are an expert web designer. Output ONLY valid HTML with internal CSS. No talk. Just code. Use modern aesthetics, premium fonts, and subtle animations. Layout: ${builderLayout.value || 'modern'}. Navbar: ${builderNavbar.value || 'top'}.`;

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt: fullPrompt,
                systemPrompt
            })
        });

        const result = await response.json();
        let code = result.choices?.[0]?.message?.content || "Error generating code.";
        code = code.replace(/```html/g, '').replace(/```/g, '').trim();

        currentCode = code;
        updatePreview(code);
        removeMessage(loadingId);
        addMessage('assistant', currentMode === 'edit' ? 'Edits applied!' : 'Design generated!');
    } catch (error) {
        console.error(error);
        removeMessage(loadingId);
        addMessage('assistant', 'Error: Failed to reach the AI model.');
    }
}

function constructBuilderContext() {
    const layout = builderLayout.value;
    const navbar = builderNavbar.value;
    const font = builderFont.value;
    const animType = builderAnimType.value;
    const duration = builderAnimDuration.value;
    const delay = builderAnimDelay.value;
    const scene = builderAnimScene.value;
    const direction = builderAnimDirection.value;
    const timing = builderAnimTiming.value;
    const colorMode = builderColorMode.value;
    const accentColor = builderAccentColor.value;

    let context = '';
    if (layout) context += `Layout: ${layout}. `;
    if (navbar) context += `Navbar: ${navbar}. `;
    if (font) context += `Primary Font Style: ${font}. `;
    if (colorMode) context += `Color Mode: ${colorMode}. `;
    if (accentColor) context += `Accent Color: ${accentColor}. `;
    if (animType) context += `Animations: ${animType} type, ${duration}s duration, ${delay}s delay, Scene: ${scene}, Direction: ${direction}, Timing: ${timing}. `;
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
    document.getElementById('chat-mode-toggle')?.classList.remove('hidden');
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
                e.target.style.outline = '2px solid #6366f1';
                e.target.style.outlineOffset = '2px';
                
                // Show tag tooltip
                let tooltip = document.getElementById('aura-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'aura-tooltip';
                    tooltip.style.position = 'fixed';
                    tooltip.style.background = '#6366f1';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '2px 8px';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.zIndex = '9999';
                    tooltip.style.pointerEvents = 'none';
                    document.body.appendChild(tooltip);
                }
                tooltip.textContent = '<' + e.target.tagName.toLowerCase() + '>';
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = rect.top - 25 + 'px';
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
