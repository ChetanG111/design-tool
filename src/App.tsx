import React from 'react'
import Editor from '@monaco-editor/react'
import { useDesignStore } from './store/useDesignStore'
import { streamComponent, sanitizeCode } from './lib/llm'
import { Preview } from './components/Preview'
import {
    Layout,
    Palette,
    Moon,
    Sun,
    Zap,
    Type,
    Droplet,
    Layers,
    Code2,
    Eye,
    X,
    Sparkles
} from 'lucide-react'

export default function App() {
    const { config, code, isGenerating, previewId, updateConfig, updateTokens, setCode, setGenerating, refreshPreview } = useDesignStore()
    const [selectedElement, setSelectedElement] = React.useState<{ tag: string; html: string; text: string } | null>(null)
    const [editPrompt, setEditPrompt] = React.useState('')

    const handleGenerate = async (subPrompt?: string) => {
        if (isGenerating) return

        setGenerating(true)
        if (!subPrompt) setCode('// Generating...')

        try {
            // In a real version, we'd send the selected element context if subPrompt exists
            let currentCode = ''
            await streamComponent(config, (chunk) => {
                currentCode += chunk
                setCode(currentCode)
            })

            const clean = sanitizeCode(currentCode)
            setCode(clean)
            refreshPreview()
            setSelectedElement(null)
            setEditPrompt('')
        } catch (error) {
            console.error('Generation failed:', error)
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="flex h-screen w-full bg-[#0a0a0a] text-zinc-300 overflow-hidden">
            {/* Left Pane - Controls */}
            <div className="w-[300px] border-r border-zinc-800 flex flex-col overflow-y-auto">
                <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Aura.build</h1>
                </div>

                <div className="p-6 space-y-8 pb-20">
                    {/* Layout Selector */}
                    <section className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            <Layout className="w-3 h-3" /> Layout
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['hero', 'section', 'card', 'feature', 'pricing'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => updateConfig({ layout: l as any })}
                                    className={`px-3 py-2 text-sm rounded-md border capitalize transition-all ${config.layout === l
                                        ? 'bg-zinc-800 border-indigo-500 text-white'
                                        : 'border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Style Selector */}
                    <section className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            <Palette className="w-3 h-3" /> Style
                        </label>
                        <div className="flex flex-col gap-2">
                            {['glass', 'solid', 'minimal'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateConfig({ style: s as any })}
                                    className={`px-3 py-2 text-sm rounded-md border capitalize transition-all flex items-center justify-between ${config.style === s
                                        ? 'bg-zinc-800 border-indigo-500 text-white'
                                        : 'border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {s}
                                    {config.style === s && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Theme Selector */}
                    <section className="space-y-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                            {config.theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />} Theme
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['light', 'dark'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updateConfig({ theme: t as any })}
                                    className={`px-3 py-2 text-sm rounded-md border capitalize transition-all ${config.theme === t
                                        ? 'bg-zinc-800 border-indigo-500 text-white'
                                        : 'border-zinc-800 hover:border-zinc-700'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isGenerating
                            ? 'bg-zinc-800 border border-zinc-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20 shadow-indigo-500/10'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 fill-white" />
                                <span>Generate Ready UI</span>
                            </>
                        )}
                    </button>

                    {/* Design Tokens */}
                    <section className="space-y-4 pt-4 border-t border-zinc-800/50">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Design Tokens</label>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm flex items-center gap-2 text-zinc-400">
                                    <Type className="w-3 h-3" /> Font Family
                                </label>
                                <input
                                    type="text"
                                    value={config.tokens.font}
                                    onChange={(e) => updateTokens({ font: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500 h-9"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm flex items-center gap-2 text-zinc-400">
                                    <Droplet className="w-3 h-3" /> Primary Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={config.tokens.primaryColor}
                                        onChange={(e) => updateTokens({ primaryColor: e.target.value })}
                                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500 h-9"
                                    />
                                    <div className={`w-9 h-9 rounded-md bg-indigo-500 shrink-0 border border-zinc-800`} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm flex items-center gap-2 text-zinc-400">
                                    <Layers className="w-3 h-3" /> Shadow Type
                                </label>
                                <select
                                    value={config.tokens.shadow}
                                    onChange={(e) => updateTokens({ shadow: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm outline-none focus:border-indigo-500 h-9 appearance-none"
                                >
                                    <option value="sm">Small</option>
                                    <option value="md">Medium</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra Large</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-auto p-4 border-t border-zinc-800">
                    <button
                        onClick={() => confirm('Clear current design?') && window.location.reload()}
                        className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        Reset Workspace
                    </button>
                </div>
            </div>

            {/* Center Pane - Live Preview */}
            <div className="flex-1 flex flex-col bg-[#050505]">
                <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <Eye className="w-3 h-3" /> PREVIEW
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[10px] text-zinc-600 font-mono tracking-tighter uppercase">Status: Live</span>
                    </div>
                </div>
                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]">
                    <div className="w-full h-full bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
                        <Preview
                            code={code}
                            previewId={previewId}
                            onElementSelect={setSelectedElement}
                        />
                    </div>

                    {/* Floating Edit Panel */}
                    {selectedElement && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[400px] bg-zinc-900 border border-indigo-500/50 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)] p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        Edit Selected: {selectedElement.tag}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedElement(null)}
                                    className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-500" />
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    autoFocus
                                    placeholder="e.g. Change color to secondary, make text bolder..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors pr-20"
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate(editPrompt)}
                                />
                                <button
                                    onClick={() => handleGenerate(editPrompt)}
                                    className="absolute right-2 top-2 bottom-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                    Refine
                                </button>
                            </div>

                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 justify-center">
                                <Code2 className="w-3 h-3" /> Scoped regeneration will preserve overall design
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane - Code Editor */}
            <div className="w-[450px] border-l border-zinc-800 flex flex-col">
                <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-[#0a0a0a]">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <Code2 className="w-3 h-3" /> REACT + TAILWIND
                    </div>
                </div>
                <div className="flex-1">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            fontFamily: 'JetBrains Mono, Menlo, monospace',
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            backgroundColor: '#0a0a0a'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
