import { chatMessages, previewFrame, codeContent, codeView, app, topBar, chatHeader, previewContainer, promptBuilderBtn, promptBuilderPanel, modalBackdrop, promptInput, inlineModeSelect } from './elements';
import { DESIGN_MODE_SCRIPT } from './constants';
import * as state from './state';

export function initCustomSelects() {
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

export function addMessage(role: string, text: string) {
    const id = Date.now().toString();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.id = id;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

export function removeMessage(id: string) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

export function updatePreview(code: string) {
    if (!code) {
        previewFrame.src = 'about:blank';
        codeContent.textContent = '';
        return;
    }

    const finalCode = code.includes('</body>')
        ? code.replace('</body>', DESIGN_MODE_SCRIPT + '</body>')
        : code + DESIGN_MODE_SCRIPT;

    const blob = new Blob([finalCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    codeContent.textContent = code;
}

export function updateViewType(view: string) {
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

export function updatePreviewMode(mode: string) {
    codeView.classList.toggle('hidden', mode !== 'code');

    // Notify iframe about design mode
    previewFrame.contentWindow?.postMessage({
        type: 'toggle-design-mode',
        enabled: mode === 'design'
    }, '*');
}

export function switchToSplitMode() {
    app.classList.remove('entry-mode');
    app.classList.add('split-mode');
    topBar.classList.remove('hidden');
    chatHeader.classList.remove('hidden');
    chatMessages.classList.remove('hidden');
    previewContainer.classList.remove('hidden');
    promptBuilderBtn.classList.add('hidden');
    promptBuilderPanel.classList.add('hidden');
}

export function switchToEditMode() {
    state.setCurrentMode('edit');
    if (inlineModeSelect) {
        inlineModeSelect.value = 'edit';
        // Update custom trigger text if it exists
        const triggerText = inlineModeSelect.closest('.custom-select')?.querySelector('.select-trigger span');
        if (triggerText) triggerText.textContent = 'Edit Mode';
        // Update selected class in custom options
        const options = inlineModeSelect.closest('.custom-select')?.querySelectorAll('.option');
        options?.forEach(opt => {
            opt.classList.toggle('selected', (opt as HTMLElement).dataset.value === 'edit');
        });
    }
    promptInput.placeholder = "Tell me what to edit...";
}
