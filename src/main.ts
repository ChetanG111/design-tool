import { setupEventListeners } from './modules/events.ts';
import { initCustomSelects } from './modules/ui.ts';
import { loadTemplates } from './modules/templates.ts';
import { initializeElements } from './modules/elements.ts';

// Live Reload
const eventSource = new EventSource('/hot-reload');
eventSource.onmessage = (event) => {
    if (event.data === 'reload') {
        console.log("File change detected, reloading...");
        window.location.reload();
    }
};

// Initialize
async function init() {
    // 1. Load HTML templates first
    await loadTemplates();

    // 2. Initialize DOM element references
    initializeElements();

    // 3. Setup logic and events
    setupEventListeners();
    initCustomSelects();

    console.log("Aura initialized successfully.");
}

document.addEventListener('DOMContentLoaded', init);
