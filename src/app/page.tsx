'use client';

import React from 'react';
import { motion } from 'framer-motion';

const messages = [
    {
        id: 1,
        role: 'user',
        content: 'Could we try a more muted palette for the primary call-to-action buttons? The current blue feels a bit loud.',
        time: '12:45 PM'
    },
    {
        id: 2,
        role: 'assistant',
        content: "I've analyzed the primary CTA colors. A more muted slate or deep indigo might work better. I've updated the hero section mockup with these variations.",
        time: '12:46 PM'
    },
    {
        id: 3,
        role: 'user',
        content: 'The mobile navigation transition feels slightly abrupt. Can we introduce some bounce easing?',
        time: '1:02 PM'
    },
    {
        id: 4,
        role: 'assistant',
        content: 'Absolutely. I can adjust the Framer Motion transition to use a spring-based physics with a slight bounce (stiffness: 400, damping: 25). Would you like to preview it now?',
        time: '1:03 PM'
    }
];


export default function Home() {
    return (
        <div className="flex h-screen w-full bg-neutral-900 text-neutral-300 font-sans overflow-hidden">
            {/* Chat Sidebar (30%) - AI Chat Interface */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="w-[30%] border-r border-neutral-800 flex flex-col bg-neutral-900/50 backdrop-blur-xl"
            >
                <div className="p-5 border-b border-neutral-800 flex items-center justify-center">
                    <h2 className="text-sm font-semibold tracking-tight text-neutral-100 uppercase">Chat</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.05 * i, type: "spring", damping: 20 }}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700/50'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-neutral-600 mt-1.5 px-1 font-medium tracking-tight">
                                {msg.time}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <div className="px-4 pb-4 pt-2 bg-neutral-900/80 border-t border-neutral-800">
                    <div className="relative group flex items-center">
                        <textarea
                            rows={1}
                            placeholder="Ask the AI anything..."
                            className="w-full bg-neutral-800 border-none rounded-2xl py-4 pl-4 pr-32 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-neutral-600 resize-none custom-scrollbar"
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                            <button title="Attach" className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors flex items-center justify-center">
                                <iconify-icon icon="solar:gallery-linear" className="text-xl" />
                            </button>
                            <button title="Design Mode" className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors flex items-center justify-center">
                                <iconify-icon icon="solar:plain-linear" className="text-xl" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-indigo-500 text-neutral-900 hover:bg-indigo-400 transition-all flex items-center justify-center">
                                <iconify-icon icon="solar:arrow-up-linear" className="text-lg font-bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area (70%) */}
            <main className="w-[70%] flex flex-col relative overflow-hidden bg-neutral-950">
                <header className="h-14 border-b border-neutral-800 flex items-center justify-between px-6 backdrop-blur-sm z-10 bg-neutral-900/80">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-neutral-500 uppercase tracking-widest">Project</span>
                        <h1 className="text-base font-medium text-neutral-200">Refined_Interface_v2</h1>
                        <iconify-icon icon="solar:alt-arrow-down-linear" className="text-xs text-neutral-500" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center rounded-md p-0.5 bg-neutral-800">
                            <button className="px-3 py-1 text-xs font-medium rounded-sm shadow-sm transition-all bg-neutral-700 text-neutral-100">Design</button>
                            <button className="px-3 py-1 text-xs font-medium transition-colors text-neutral-400 hover:text-neutral-200">Code</button>
                        </div>
                        <div className="h-4 w-px bg-neutral-800" />
                        <button className="transition-colors flex items-center text-neutral-400 hover:text-neutral-100">
                            <iconify-icon icon="solar:share-linear" className="text-xl" />
                        </button>
                        <button className="text-xs font-semibold px-4 py-1.5 rounded-md transition-all text-neutral-900 bg-indigo-500 hover:bg-indigo-600">
                            Export
                        </button>
                    </div>
                </header>

                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-12">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="w-full max-w-4xl aspect-[16/10] border border-neutral-800 rounded-lg shadow-2xl overflow-hidden flex flex-col bg-neutral-900"
                    >
                        <div className="h-12 border-b border-neutral-800 flex items-center px-8 justify-between">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 rounded-full bg-neutral-700" />
                            </div>
                            <div className="w-32 h-2 rounded-full bg-neutral-800" />
                            <div className="w-8 h-8 rounded-full bg-neutral-800" />
                        </div>
                        <div className="flex-1 p-12 space-y-8">
                            <div className="space-y-4">
                                <div className="w-2/3 h-10 rounded-lg bg-neutral-800/50" />
                                <div className="w-1/2 h-4 rounded-lg bg-neutral-800/30" />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="h-40 border border-neutral-800/50 rounded-xl bg-neutral-800/20" />
                                <div className="h-40 border border-neutral-800/50 rounded-xl bg-neutral-800/20" />
                                <div className="h-40 border border-neutral-800/50 rounded-xl bg-neutral-800/20" />
                            </div>
                            <div className="space-y-4">
                                <div className="w-full h-4 rounded-lg bg-neutral-800/30" />
                                <div className="w-full h-4 rounded-lg bg-neutral-800/30" />
                                <div className="w-3/4 h-4 rounded-lg bg-neutral-800/30" />
                            </div>
                        </div>
                    </motion.div>


                </div>
            </main>
        </div>
    );
}
