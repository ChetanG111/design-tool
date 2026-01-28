"use client";

import React, { useState } from 'react';
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
    RefreshCw
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DesignTool() {
    const { designConfig, setDesignConfig, generatedCode, setGeneratedCode, isGenerating, setIsGenerating } = useStore();
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    const layouts = ['hero-section', 'features', 'pricing', 'contact'];
    const styles = ['modern', 'minimal', 'glassmorphism', 'playful'];

    return (
        <main className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Left Sidebar: Controls */}
            <aside className="w-80 border-r border-border bg-card/50 flex flex-col">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Sparkles size={18} />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">Aura.build</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Layout Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Layout size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Structure</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {layouts.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setDesignConfig({ layout: l })}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm transition-all border text-left capitalize",
                                        designConfig.layout === l
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:border-white/20"
                                    )}
                                >
                                    {l.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Style Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Palette size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Aesthetics</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {styles.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setDesignConfig({ style: s })}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm transition-all border text-left capitalize",
                                        designConfig.style === s
                                            ? "bg-primary/10 border-primary text-primary"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:border-white/20"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Prompt Section Placeholder */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Layers size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Configuration</span>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border text-[11px] font-mono text-muted-foreground leading-relaxed">
                            {"{ \n  \"layout\": \"" + designConfig.layout + "\",\n  \"style\": \"" + designConfig.style + "\",\n  \"mode\": \"react-tailwind\"\n}"}
                        </div>
                    </section>
                </div>

                <div className="p-4 border-t border-border">
                    <button
                        disabled={isGenerating}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                        Generate Code
                    </button>
                </div>
            </aside>

            {/* Main Content: Preview & Code */}
            <section className="flex-1 flex flex-col relative">
                <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm">
                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all",
                                activeTab === 'preview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Eye size={14} />
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-all",
                                activeTab === 'code' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Code2 size={14} />
                            Code
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">
                            <CheckCircle2 size={12} />
                            Live Sync
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'preview' ? (
                        <div className="absolute inset-0 p-8 flex items-center justify-center bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]">
                            <div className="w-full h-full max-w-5xl glass-panel rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                                        <Eye className="text-primary" size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">Preview Canvas</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                            Your generated component will render here in real-time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <Editor
                                height="100%"
                                defaultLanguage="typescript"
                                theme="vs-dark"
                                value={generatedCode}
                                onChange={(value) => setGeneratedCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    padding: { top: 20 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    lineNumbers: 'on',
                                    glyphMargin: false,
                                    folding: true,
                                    lineDecorationsWidth: 10,
                                    lineNumbersMinChars: 3,
                                    background: '#00000000'
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
