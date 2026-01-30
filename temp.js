// src/main.ts
var eventSource = new EventSource("/hot-reload");
eventSource.onmessage = (event) => {
  if (event.data === "reload") {
    console.log("File change detected, reloading...");
    window.location.reload();
  }
};
var isFirstPrompt = true;
var currentCode = "";
var currentMode = "design";
var selectedElementTag = "";
var app = document.getElementById("app");
var topBar = document.getElementById("top-bar");
var chatHeader = document.getElementById("chat-header");
var chatMessages = document.getElementById("chat-messages");
var previewContainer = document.getElementById("preview-container");
var promptInput = document.getElementById("prompt-input");
var sendBtn = document.getElementById("send-btn");
var promptBuilderBtn = document.getElementById("prompt-builder-btn");
var promptBuilderPanel = document.getElementById("prompt-builder-panel");
var previewFrame = document.getElementById("preview-frame");
var codeView = document.getElementById("code-view");
var codeContent = document.getElementById("code-content");
var builderLayout = document.getElementById("builder-layout");
var builderNavbar = document.getElementById("builder-navbar");
var builderFont = document.getElementById("builder-font");
var builderAnimType = document.getElementById("builder-anim-type");
var builderAnimDuration = document.getElementById("builder-anim-duration");
var builderAnimDelay = document.getElementById("builder-anim-delay");
var builderAnimScene = document.getElementById("builder-anim-scene");
var builderAnimDirection = document.getElementById("builder-anim-direction");
var builderAnimTiming = document.getElementById("builder-anim-timing");
var builderColorMode = document.getElementById("builder-color-mode");
var builderAccentColor = document.getElementById("builder-accent-color");
function init() {
  setupEventListeners();
  initCustomSelects();
}
function initCustomSelects() {
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    if (select.closest(".dropdown-content"))
      return;
    if (select.dataset.enhanced)
      return;
    select.dataset.enhanced = "true";
    const container = document.createElement("div");
    container.className = "custom-select";
    const trigger = document.createElement("div");
    trigger.className = "select-trigger";
    const selectedText = document.createElement("span");
    selectedText.textContent = select.options[select.selectedIndex]?.text || "Select...";
    const icon = document.createElement("div");
    icon.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
    trigger.appendChild(selectedText);
    trigger.appendChild(icon);
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "select-options";
    Array.from(select.options).forEach((opt, idx) => {
      const optionEl = document.createElement("div");
      optionEl.className = "option";
      if (idx === select.selectedIndex)
        optionEl.classList.add("selected");
      optionEl.textContent = opt.text;
      optionEl.dataset.value = opt.value;
      optionEl.addEventListener("click", () => {
        select.value = opt.value;
        selectedText.textContent = opt.text;
        optionsContainer.querySelectorAll(".option").forEach((o) => o.classList.remove("selected"));
        optionEl.classList.add("selected");
        container.classList.remove("active");
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      optionsContainer.appendChild(optionEl);
    });
    container.appendChild(trigger);
    container.appendChild(optionsContainer);
    select.parentNode?.insertBefore(container, select);
    container.appendChild(select);
    if (select.closest(".input-actions")) {
      container.classList.add("open-top");
    }
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".custom-select").forEach((s) => {
        if (s !== container)
          s.classList.remove("active");
      });
      container.classList.toggle("active");
    });
  });
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select").forEach((s) => s.classList.remove("active"));
  });
}
function setupEventListeners() {
  sendBtn.addEventListener("click", handleSend);
  promptBuilderBtn.addEventListener("click", () => promptBuilderPanel.classList.toggle("hidden"));
  document.getElementById("back-btn")?.addEventListener("click", () => {
    app.classList.remove("split-mode");
    app.classList.add("entry-mode");
    topBar.classList.add("hidden");
    isFirstPrompt = true;
    chatMessages.innerHTML = "";
    currentCode = "";
    updatePreview("");
  });
  document.getElementById("add-to-prompt-btn")?.addEventListener("click", () => {
    const context = constructBuilderContext();
    const existing = promptInput.value.trim();
    const newValue = existing ? `${context}

Additional Instructions: ${existing}` : context;
    promptInput.value = newValue;
    const finalPrompt = constructPrompt(newValue);
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `FINAL PROMPT PREVIEW:
${finalPrompt}` })
    });
    promptBuilderPanel.classList.add("hidden");
    promptInput.focus();
    promptInput.scrollTop = promptInput.scrollHeight;
  });
  document.getElementById("export-btn")?.addEventListener("click", () => {
    const blob = new Blob([currentCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.html";
    a.click();
  });
  document.querySelectorAll(".view-switchers .switcher-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const view = target.dataset.view;
      updateViewType(view);
      document.querySelectorAll(".view-switchers .switcher-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    });
  });
  document.querySelectorAll(".mode-switchers .switcher-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const mode = target.dataset.view;
      updatePreviewMode(mode);
      document.querySelectorAll(".mode-switchers .switcher-btn").forEach((b) => b.classList.remove("active"));
      target.classList.add("active");
    });
  });
  const inlineModeSelect = document.getElementById("inline-mode-select");
  inlineModeSelect?.addEventListener("change", (e) => {
    const target = e.target;
    currentMode = target.value;
    if (currentMode === "edit") {
      promptInput.placeholder = "Tell me what to edit...";
    } else {
      promptInput.placeholder = "Describe a new design...";
    }
  });
  document.querySelectorAll("[data-font]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const font = e.target.dataset.font;
      injectStyle(`body { font-family: '${font}', sans-serif !important; }`);
    });
  });
  document.querySelectorAll("[data-theme]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const theme = e.target.dataset.theme;
      const color = theme === "dark" ? "#0a0a0a" : "#ffffff";
      const textColor = theme === "dark" ? "#ffffff" : "#0a0a0a";
      injectStyle(`body { background-color: ${color} !important; color: ${textColor} !important; }`);
    });
  });
  document.querySelectorAll("[data-anim]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const anim = e.target.dataset.anim;
      if (anim === "fade") {
        injectStyle(`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
                            section, div, h1, h2, p { animation: fadeIn 1s ease-out forwards; }`);
      } else if (anim === "slide") {
        injectStyle(`@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                            section, div, h1, h2, p { animation: slideUp 0.8s ease-out forwards; }`);
      }
    });
  });
  window.addEventListener("message", (event) => {
    if (event.data.type === "element-selected") {
      selectedElementTag = event.data.tag;
      promptInput.value = `Edit this element (${selectedElementTag}): `;
      promptInput.focus();
      switchToEditMode();
    }
  });
}
function switchToEditMode() {
  currentMode = "edit";
  const select = document.getElementById("inline-mode-select");
  if (select) {
    select.value = "edit";
    const triggerText = select.closest(".custom-select")?.querySelector(".select-trigger span");
    if (triggerText)
      triggerText.textContent = "Edit Mode";
    const options = select.closest(".custom-select")?.querySelectorAll(".option");
    options?.forEach((opt) => {
      opt.classList.toggle("selected", opt.dataset.value === "edit");
    });
  }
  promptInput.placeholder = "Tell me what to edit...";
}
async function handleSend() {
  const prompt = promptInput.value.trim();
  if (!prompt && !builderLayout.value)
    return;
  const fullPrompt = constructPrompt(prompt);
  const model = document.getElementById("inline-model-select").value;
  if (isFirstPrompt) {
    switchToSplitMode();
    isFirstPrompt = false;
  }
  addMessage("user", prompt || "Designing based on template selections...");
  promptInput.value = "";
  const loadingId = addMessage("assistant", "Processing request...");
  try {
    const designSystemInstructions = `
STRICT RULES:
1. USE ONLY HTML AND TAILWIND CSS.
2. NO EXTERNAL CSS OR INTERNAL <style> TAGS (except Google Font imports).
3. NO GRADIENTS WHATSOEVER unless explicitly requested in the prompt. Use solid colors, subtle borders, and clean whitespace.
4. USE TAILWIND PLAY CDN: <script src="https://cdn.tailwindcss.com"></script>
5. ARCHITECTURE: Build a complete, responsive landing page.
6. AESTHETICS: Modern, premium, minimalist. Use large font sizes for headings, optimal line heights, and generous padding/margin.
7. COLORS: Use a refined color palette (e.g., slate, stone, or neutral) with matching accent colors.
8. INTERACTION: Add subtle Tailwind hover transitions to buttons and links while keeping the texts visible
`;
    const systemPrompt = currentMode === "edit" ? `You are an expert editor. Modify the existing code according to user instructions.${designSystemInstructions} Return ONLY the complete updated HTML document. Existing Code: 
${currentCode}` : `You are an expert web designer. ${designSystemInstructions} Layout: ${builderLayout.value || "modern"}. Navbar: ${builderNavbar.value || "top"}. Create a stunning, high-converting landing page. Return ONLY valid HTML.`;
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        systemPrompt
      })
    });
    const result = await response.json();
    let code = result.choices?.[0]?.message?.content || "Error generating code.";
    code = code.replace(/```html/g, "").replace(/```/g, "").trim();
    currentCode = code;
    updatePreview(code);
    removeMessage(loadingId);
    addMessage("assistant", currentMode === "edit" ? "Edits applied!" : "Design generated!");
  } catch (error) {
    console.error(error);
    removeMessage(loadingId);
    addMessage("assistant", "Error: Failed to reach the AI model.");
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
  let context = "";
  if (layout)
    context += `Layout: ${layout}. `;
  if (navbar)
    context += `Navbar: ${navbar}. `;
  if (font)
    context += `Primary Font Style: ${font}. `;
  if (colorMode)
    context += `Color Mode: ${colorMode}. `;
  if (accentColor)
    context += `Accent Color: ${accentColor}. `;
  if (animType)
    context += `Animations: ${animType} type, ${duration}s duration, ${delay}s delay, Scene: ${scene}, Direction: ${direction}, Timing: ${timing}. `;
  return context.trim();
}
function constructPrompt(userPrompt) {
  if (currentMode === "edit")
    return userPrompt;
  const builderContext = constructBuilderContext();
  return `${builderContext} ${userPrompt}`.trim();
}
function switchToSplitMode() {
  app.classList.remove("entry-mode");
  app.classList.add("split-mode");
  topBar.classList.remove("hidden");
  chatHeader.classList.remove("hidden");
  chatMessages.classList.remove("hidden");
  previewContainer.classList.remove("hidden");
  promptBuilderBtn.classList.add("hidden");
  promptBuilderPanel.classList.add("hidden");
}
function updatePreview(code) {
  if (!code) {
    previewFrame.src = "about:blank";
    codeContent.textContent = "";
    return;
  }
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
  const finalCode = code.includes("</body>") ? code.replace("</body>", designScript + "</body>") : code + designScript;
  const blob = new Blob([finalCode], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  previewFrame.src = url;
  codeContent.textContent = code;
}
function injectStyle(css) {
  if (!currentCode)
    return;
  if (currentCode.includes("</style>")) {
    currentCode = currentCode.replace("</style>", `${css}
</style>`);
  } else if (currentCode.includes("</head>")) {
    currentCode = currentCode.replace("</head>", `<style>${css}</style>
</head>`);
  } else {
    currentCode += `<style>${css}</style>`;
  }
  updatePreview(currentCode);
}
function updateViewType(view) {
  if (view === "mobile") {
    previewFrame.style.width = "375px";
    previewFrame.style.margin = "20px auto";
    previewFrame.style.height = "calc(100% - 40px)";
    previewFrame.style.border = "12px solid #222";
    previewFrame.style.borderRadius = "32px";
  } else {
    previewFrame.style.width = "100%";
    previewFrame.style.margin = "0";
    previewFrame.style.height = "100%";
    previewFrame.style.border = "none";
    previewFrame.style.borderRadius = "12px";
  }
}
function updatePreviewMode(mode) {
  codeView.classList.toggle("hidden", mode !== "code");
  previewFrame.contentWindow?.postMessage({
    type: "toggle-design-mode",
    enabled: mode === "design"
  }, "*");
}
function addMessage(role, text) {
  const id = Date.now().toString();
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${role}`;
  msgDiv.id = id;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}
function removeMessage(id) {
  const el = document.getElementById(id);
  if (el)
    el.remove();
}
document.addEventListener("DOMContentLoaded", init);
