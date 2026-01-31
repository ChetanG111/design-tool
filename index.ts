import { serve, file as bunFile } from "bun";
import { join } from "path";
import { watch, readFileSync, existsSync, mkdirSync, readdirSync } from "fs";

const SYSTEM_PROMPT = readFileSync("./prompts/system-prompt.txt", "utf-8");

// Map layout types to their allowed techniques files
const LAYOUT_TECHNIQUE_MAP: Record<string, string> = {
    'hero': './prompts/hero_allowed.txt',
    'landing-page': './prompts/hero_allowed.txt',
};

const clients = new Set<ReadableStreamDefaultController>();

// Watch for file changes to trigger live reload
const watcher = (event: string, filename: string | null) => {
    if (filename) {
        console.log(`File changed: ${filename}. Triggering reload...`);
        for (const client of clients) {
            try {
                client.enqueue("data: reload\n\n");
            } catch (e) {
                clients.delete(client);
            }
        }
    }
};

watch("./src", { recursive: true }, watcher);
watch("./public", { recursive: true }, watcher);

const server = serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;

        // Live Reload SSE endpoint
        if (path === "/hot-reload") {
            return new Response(
                new ReadableStream({
                    start(controller) {
                        clients.add(controller);
                        req.signal.addEventListener("abort", () => {
                            clients.delete(controller);
                        });
                    },
                }),
                {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    },
                }
            );
        }

        // Serve bundled JS
        if (path === "/main.js") {
            try {
                const result = await Bun.build({
                    entrypoints: ["src/main.ts"],
                    minify: false,
                });
                if (!result.success) {
                    console.error("Build failed:", result.logs);
                    return new Response("Build failed", { status: 500 });
                }
                return new Response(result.outputs[0]);
            } catch (e) {
                return new Response("Build Error", { status: 500 });
            }
        }

        // Serve CSS
        if (path === "/style.css") {
            return new Response(Bun.file("src/style.css"));
        }

        // Simple logging endpoint for client-side logs to reach the terminal
        if (path === "/api/log" && req.method === "POST") {
            const { message } = await req.json() as any;
            console.log(`\n--- [CLIENT LOG] ---`);
            console.log(message);
            console.log(`---------------------\n`);
            return new Response("Logged");
        }

        // API: Proxy to Kimi or Gemini
        if (path === "/api/generate") {
            if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
            const body = await req.json() as any;
            let { model, prompt, systemPrompt, currentMode, layoutType } = body;

            // Use server-side system prompt for design mode
            if (!systemPrompt || currentMode === 'design') {
                systemPrompt = SYSTEM_PROMPT;
            }

            // Inject allowed techniques if layoutType is selected and we are in design mode
            if (layoutType && (currentMode === 'design' || !currentMode)) {
                const techniqueFile = LAYOUT_TECHNIQUE_MAP[layoutType];
                if (techniqueFile) {
                    try {
                        const techniques = readFileSync(techniqueFile, "utf-8");
                        prompt = `${techniques}\n\n${prompt}`;
                    } catch (e) {
                        console.error(`Failed to read technique file: ${techniqueFile}`);
                    }
                }
            }

            console.log(`\n--- [SERVER LOG] GENERATION REQUEST ---`);
            console.log(`Model: ${model}`);
            console.log(`Mode: ${currentMode || 'unspecified'}`);
            console.log(`Layout Type: ${layoutType || 'none'}`);
            console.log(`System Prompt (first 100 chars):\n${systemPrompt.substring(0, 100)}...`);
            console.log(`Full User Prompt:\n${prompt}`);
            console.log(`----------------------------------------\n`);

            async function saveGeneration(content: string) {
                try {
                    const dir = join(process.cwd(), "generations");
                    if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                    }

                    const files = readdirSync(dir).filter(f => f.startsWith('design-') && f.endsWith('.html'));
                    const nextIndex = files.length + 1;
                    const paddedIndex = nextIndex.toString().padStart(3, '0');

                    const fileName = `design-${paddedIndex}.html`;
                    const fullPath = join(dir, fileName);

                    await Bun.write(fullPath, content);
                    await Bun.write(join(dir, 'latest.html'), content);

                    console.log(`[SAVED] Saved as ${fileName} and updated latest.html`);
                } catch (e) {
                    console.error(`[ERROR] Failed to save generation:`, e);
                }
            }

            if (model === "kimi") {
                try {
                    const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.KIMI_API_KEY}`,
                        },
                        body: JSON.stringify({
                            model: "moonshot-v1-8k",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: prompt },
                            ],
                            temperature: 0.7,
                        }),
                    });
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content || "";
                    if (content) await saveGeneration(content);
                    console.log(`[API] Kimi generation complete.`);
                    return new Response(JSON.stringify(data));
                } catch (e) {
                    console.error(`[API] Kimi error:`, e);
                    return new Response(JSON.stringify({ error: "Kimi API error" }), { status: 500 });
                }
            }

            if (model === "gemini") {
                console.log("Gemini generation triggered...");
                try {
                    console.log("Gemini generation going on...");
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            system_instruction: {
                                parts: [{ text: systemPrompt }]
                            },
                            contents: [
                                {
                                    parts: [{ text: prompt }]
                                }
                            ],
                            generationConfig: {
                                temperature: 0.7,
                                topK: 40,
                                topP: 0.95,
                                maxOutputTokens: 8192,
                            }
                        }),
                    });
                    const data = (await response.json()) as any;
                    if (data.error) {
                        console.error("Gemini API Error details:", data.error);
                        return new Response(JSON.stringify({ error: data.error.message }), { status: 400 });
                    }

                    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No valid content generated by Gemini.";
                    console.log("Gemini generation done. Content Length:", content.length);

                    if (content && !content.startsWith("Error:")) {
                        await saveGeneration(content);
                    }

                    return new Response(JSON.stringify({
                        choices: [{
                            message: { content }
                        }]
                    }));
                } catch (e) {
                    console.error("Gemini Error:", e);
                    return new Response(JSON.stringify({ error: "Gemini API error" }), { status: 500 });
                }
            }

            return new Response("Model not implemented", { status: 501 });
        }

        // Serve public static files
        let filePath = join("public", path === "/" ? "index.html" : path);
        const file = Bun.file(filePath);
        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Server running at http://localhost:${server.port}`);