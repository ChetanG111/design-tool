import * as elements from './elements';
import * as state from './state';
import * as ui from './ui';
import * as api from './api';

export function setupEventListeners() {
    elements.sendBtn.addEventListener('click', api.handleSend);

    elements.promptBuilderBtn.addEventListener('click', () => {
        const isHidden = elements.promptBuilderPanel.classList.toggle('hidden');
        elements.modalBackdrop.classList.toggle('hidden', isHidden);
    });

    elements.modalBackdrop.addEventListener('click', () => {
        elements.promptBuilderPanel.classList.add('hidden');
        elements.modalBackdrop.classList.add('hidden');
    });

    elements.closeBuilderBtn.addEventListener('click', () => {
        elements.promptBuilderPanel.classList.add('hidden');
        elements.modalBackdrop.classList.add('hidden');
    });

    // Builder Card Clicks
    document.querySelectorAll('.builder-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = (card.parentElement as HTMLElement).dataset.category;
            if (!category) return;

            // Update selection
            state.updateBuilderSelection(category, (card as HTMLElement).dataset.value!);

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
            state.updateBuilderSelection('platform', (btn as HTMLElement).dataset.value!);
        });
    });

    // Collapsible sections
    document.querySelectorAll('.builder-category.collapsible .trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            trigger.parentElement?.classList.toggle('collapsed');
        });
    });

    // Slider Listeners
    elements.durationSlider?.addEventListener('input', () => {
        const val = elements.durationSlider.value;
        elements.durationVal.textContent = `${val}s`;
        state.updateBuilderSelection('anim-duration', parseFloat(val));
    });

    elements.delaySlider?.addEventListener('input', () => {
        const val = elements.delaySlider.value;
        elements.delayVal.textContent = `${val}s`;
        state.updateBuilderSelection('anim-delay', parseFloat(val));
    });

    // Back Button
    elements.backBtn?.addEventListener('click', () => {
        elements.app.classList.remove('split-mode');
        elements.app.classList.add('entry-mode');
        elements.topBar.classList.add('hidden');
        state.setFirstPrompt(true);
        elements.chatMessages.innerHTML = '';
        state.setCurrentCode('');
        ui.updatePreview('');
    });

    // Add to Prompt Button
    elements.addToPromptBtn?.addEventListener('click', () => {
        const context = api.constructBuilderContext();
        const existing = elements.promptInput.value.trim();
        const newValue = existing
            ? `${context}\n\nAdditional Instructions: ${existing}`
            : context;

        elements.promptInput.value = newValue;

        // Log the final prompt
        const finalPrompt = api.constructPrompt(newValue);
        fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `FINAL PROMPT PREVIEW:\n${finalPrompt}` })
        });

        elements.promptBuilderPanel.classList.add('hidden');
        elements.modalBackdrop.classList.add('hidden');
        elements.promptInput.focus();
        elements.promptInput.scrollTop = elements.promptInput.scrollHeight;
    });

    // Export Button
    elements.exportBtn?.addEventListener('click', () => {
        const blob = new Blob([state.currentCode], { type: 'text/html' });
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
            ui.updateViewType(view!);
            document.querySelectorAll('.view-switchers .switcher-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Mode Switchers
    document.querySelectorAll('.mode-switchers .switcher-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLButtonElement;
            const mode = target.dataset.view;
            ui.updatePreviewMode(mode!);
            document.querySelectorAll('.mode-switchers .switcher-btn').forEach(b => b.classList.remove('active'));
            target.classList.add('active');
        });
    });

    // Handle messages from iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'element-selected') {
            state.setSelectedElementTag(event.data.tag);
            elements.promptInput.value = `Edit this element (${event.data.tag}): `;
            elements.promptInput.focus();
            ui.switchToEditMode();
        }
    });

    // Global click listener for selects is already in ui.ts initCustomSelects
}
