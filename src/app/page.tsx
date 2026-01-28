"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '@/lib/store';
import {
    Layout,
    Palette,
    Zap,
    Code2,
    Eye,
    CheckCircle2,
    Layers,
    Sparkles,
    RefreshCw,
    MousePointer2,
    X,
    Send,
    Sliders,
    Copy,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generateSuperPrompt } from '@/lib/orchestrator';
import { PreviewFrame } from '@/components/PreviewFrame';
import copy from 'copy-to-clipboard';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DesignTool() {
    const {
        designConfig,
        setDesignConfig,
        designTokens,
        setDesignTokens,
        generatedCode,
        setGeneratedCode,
        isGenerating,
        setIsGenerating
    } = useStore();

    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [editPrompt, setEditPrompt] = useState('');
    const [copied, setCopied] = useState(false);

    const layouts = ['hero-section', 'features', 'pricing', 'contact'];
    const styles = ['modern', 'minimal', 'glassmorphism', 'playful'];

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'node-selected') {
                setSelectedNode(event.data);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleGenerate = async (isEdit = false) => {
        setIsGenerating(true);
        if (!isEdit) setGeneratedCode("// Initializing generation pipeline...");

        try {
            let prompt = generateSuperPrompt(designConfig);

            if (isEdit && selectedNode) {
                prompt = `
You are editing an existing React component.
CURRENT CODE:
${generatedCode}

USER REQUEST: ${editPrompt}
TARGET ELEMENT: ${selectedNode.tagName} with class "${selectedNode.className}" and path "${selectedNode.path}"

### INSTRUCTIONS
- Modify ONLY the target element or its related styles/logic as requested.
- Keep the overall structure and "Preview" export name.
- Use only Tailwind CSS and Lucide-React.
- RETURN ONLY THE UPDATED CODE. NO MARKDOWN FENCES.
`.trim();
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('Generation pipeline failed');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullCode = '';

            if (reader) {
                setGeneratedCode("");
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullCode += chunk;

                    const cleanCode = fullCode
                        .replace(/```jsx/g, '')
                        .replace(/```tsx/g, '')
                        .replace(/```javascript/g, '')
                        .replace(/```typescript/g, '')
                        .replace(/```/g, '');

                    setGeneratedCode(cleanCode);
                }
            }
            if (isEdit) {
                setEditPrompt('');
                setSelectedNode(null);
            }
        } catch (err) {
            console.error(err);
            setGeneratedCode(`// Critical Pipeline Error: ${err instanceof Error ? err.message : 'Unknown exception'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = useCallback(() => {
        copy(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [generatedCode]);

    const handleReset = () => {
        if (confirm('Reset all changes? This cannot be undone.')) {
            window.location.reload();
        }
    };

    return (
        <main className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/20">
            {/* Left Sidebar: Orchestration Controls */}
            <aside className="w-80 border-r border-border bg-card/40 flex flex-col z-40">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight leading-none">Aura.build</h1>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium bg-white/5 px-1.5 py-0.5 rounded inline-block uppercase tracking-wider">v1.0 Light</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-9 custom-scrollbar">
                    {/* Layout Segment */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Layout size={14} className="opacity-60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Orchestration</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {layouts.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setDesignConfig({ layout: l })}
                                    className={cn(
                                        "px-3 py-2.5 rounded-xl text-[11px] transition-all border text-left capitalize font-semibold",
                                        designConfig.layout === l
                                            ? "bg-primary/10 border-primary/40 text-primary shadow-[inset_0_0_15px_rgba(255,255,255,0.03)]"
                                            : "bg-secondary/20 border-white/5 text-muted-foreground hover:border-white/10 hover:bg-secondary/40"
                                    )}
                                >
                                    {l.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Aesthetic Segment */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Palette size={14} className="opacity-60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Aesthetics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {styles.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setDesignConfig({ style: s })}
                                    className={cn(
                                        "px-3 py-2.5 rounded-xl text-[11px] transition-all border text-left capitalize font-semibold",
                                        designConfig.style === s
                                            ? "bg-primary/10 border-primary/40 text-primary shadow-[inset_0_0_15px_rgba(255,255,255,0.03)]"
                                            : "bg-secondary/20 border-white/5 text-muted-foreground hover:border-white/10 hover:bg-secondary/40"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Design Token segment */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Sliders size={14} className="opacity-60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Hard Tokens</span>
                        </div>
                        <div className="space-y-5 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">
                                    <span>Accents</span>
                                    <span className="font-mono text-primary">{designTokens.primary}</span>
                                </div>
                                <div className="flex gap-2.5">
                                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setDesignTokens({ primary: color })}
                                            className={cn(
                                                "w-5 h-5 rounded-full border-2 transition-all duration-300 active:scale-90",
                                                designTokens.primary === color ? "border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "border-transparent opacity-40 hover:opacity-100"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <div className="relative w-5 h-5 group">
                                        <input
                                            type="color"
                                            value={designTokens.primary}
                                            onChange={(e) => setDesignTokens({ primary: e.target.value })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 border border-white/20 transition-transform group-hover:scale-110" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">
                                    <span>Radius</span>
                                    <span className="font-mono">{designTokens.radius}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.05"
                                    value={parseFloat(designTokens.radius)}
                                    onChange={(e) => setDesignTokens({ radius: `${e.target.value}rem` })}
                                    className="w-full accent-primary bg-white/10 h-1 rounded-full appearance-none cursor-pointer hover:bg-white/20 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Prompt State segment */}
                    <section className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Layers size={14} className="opacity-60" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Prompt Flux</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-[10px] font-mono text-muted-foreground/60 leading-relaxed h-28 overflow-hidden relative group transition-colors hover:border-white/10">
                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
                            <div className="opacity-40 italic">
                                {generateSuperPrompt(designConfig)}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t border-border bg-card/30 flex flex-col gap-3">
                    <button
                        onClick={() => handleGenerate(false)}
                        disabled={isGenerating}
                        className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 hover:opacity-90 transition-all active:scale-[0.97] disabled:opacity-50 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.1)] group"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="group-hover:fill-current transition-all" />}
                        Generate Aura UI
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleReset}
                            className="py-2.5 bg-secondary/30 text-muted-foreground rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5"
                        >
                            <Trash2 size={12} />
                            Reset System
                        </button>
                        <button
                            disabled={isGenerating}
                            onClick={() => setActiveTab('code')}
                            className="py-2.5 bg-secondary/30 text-muted-foreground rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                        >
                            <Code2 size={12} />
                            Open Source
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <section className="flex-1 flex flex-col relative h-full bg-[#030303]">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#060606]/80 backdrop-blur-2xl z-40 sticky top-0">
                    <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 shadow-2xl">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all",
                                activeTab === 'preview' ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <Eye size={14} className={activeTab === 'preview' ? "fill-black" : ""} />
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2.5 transition-all",
                                activeTab === 'code' ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-white"
                            )}
                        >
                            <Code2 size={14} />
                            Build
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {activeTab === 'code' && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} />}
                                {copied ? "Copied" : "Clone Core"}
                            </button>
                        )}
                        <div className="flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase text-primary/80 bg-primary/5 px-4 py-2.5 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <div className={cn("w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]", isGenerating && "animate-pulse")} />
                            {isGenerating ? "Synthesizing..." : "System Nominal"}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'preview' ? (
                        <div className="absolute inset-0 bg-[#030303] bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] flex items-center justify-center p-8">
                            <div className="w-full h-full max-w-[1400px] max-h-[900px] relative rounded-[2rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] border border-white/10 group">
                                <PreviewFrame code={generatedCode} />
                                <div className="absolute inset-0 pointer-events-none border-[12px] border-[#0a0a0a] rounded-[2rem] ring-1 ring-white/10 opacity-50 transition-opacity group-hover:opacity-100" />
                            </div>

                            {/* Selection Floating UI (Sprint 4/5) */}
                            {selectedNode && (
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[520px] z-50 animate-in slide-in-from-bottom-12 duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                                    <div className="glass-panel rounded-3xl p-6 shadow-[0_48px_100px_-24px_rgba(0,0,0,1)] border-white/20 bg-black/80">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                                    <MousePointer2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] opacity-90">Contextual Node Edit</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono mt-1 opacity-60 max-w-[300px] truncate">{selectedNode.path || 'Root Node'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedNode(null)}
                                                className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-muted-foreground transition-all hover:text-white"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="relative">
                                            <input
                                                autoFocus
                                                value={editPrompt}
                                                onChange={(e) => setEditPrompt(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate(true)}
                                                placeholder="Re-engineer this section (e.g. 'Make it glassmorphism')..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/40 shadow-inner"
                                            />
                                            <button
                                                onClick={() => handleGenerate(true)}
                                                disabled={!editPrompt || isGenerating}
                                                className="absolute right-3 top-3 w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-90 disabled:opacity-20 shadow-lg shadow-primary/20"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-[#0a0a0a]">
                            <Editor
                                height="100%"
                                defaultLanguage="typescript"
                                theme="vs-dark"
                                value={generatedCode}
                                onChange={(value) => setGeneratedCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    padding: { top: 40, bottom: 40 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    lineNumbers: 'on',
                                    renderLineHighlight: 'all',
                                    cursorSmoothCaretAnimation: 'on',
                                    smoothScrolling: true,
                                    background: '#0a0a0a',
                                    fontWeight: '500',
                                    lineHeight: 24,
                                    letterSpacing: 0.5
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
