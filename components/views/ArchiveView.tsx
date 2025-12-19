'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { ArchiveItem } from '@/types';
import { ARCHIVE_METRICS, ARCHIVE_DATA, springConfig } from '@/lib/constants';

export const ArchiveView: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);

    return (
        <div className="flex h-full gap-4 overflow-hidden">
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <header className="flex justify-between items-center py-2">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight">System Archive</h1>
                        <p className="text-zinc-500 text-sm mt-1">Long-term memory and historical data retention</p>
                    </div>
                </header>
                <section className="grid grid-cols-4 gap-4">
                    {ARCHIVE_METRICS.map((metric) => (
                        <MetricCard key={metric.id} metric={metric} />
                    ))}
                </section>
                <div className="flex-1 bg-[#1E1E20] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-white/5 flex text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        <span className="w-1/3">Subject / Target</span>
                        <span className="w-1/4">Channel</span>
                        <span className="w-1/4">Outcome</span>
                        <span className="flex-1 text-right">Completion Date</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                        {ARCHIVE_DATA.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`flex items-center px-4 py-4 rounded-2xl cursor-pointer transition-colors group ${selectedItem?.id === item.id ? 'bg-white/5 border border-white/10' : 'border border-transparent hover:bg-white/[0.015]'
                                    }`}
                            >
                                <div className="w-1/3">
                                    <h4 className="text-sm font-semibold text-zinc-300">{item.name}</h4>
                                    <p className="text-[11px] text-zinc-600 truncate mt-0.5">{item.summary}</p>
                                </div>
                                <div className="w-1/4 flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">{item.channel}</span>
                                </div>
                                <div className="w-1/4">
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${item.outcome === 'Won' ? 'bg-[#E3FF93]/5 border-[#E3FF93]/20 text-[#E3FF93]' :
                                            item.outcome === 'Dead' ? 'bg-rose-500/5 border-rose-500/20 text-rose-500' :
                                                'bg-zinc-500/5 border-zinc-500/20 text-zinc-600'
                                        }`}>
                                        {item.outcome}
                                    </span>
                                </div>
                                <div className="flex-1 text-right">
                                    <span className="text-xs text-zinc-600">{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={springConfig}
                        className="w-80 bg-[#1E1E20] rounded-3xl border border-white/5 p-6 flex flex-col gap-6 shadow-2xl"
                    >
                        <button onClick={() => setSelectedItem(null)} className="p-2 w-fit hover:bg-white/5 rounded-xl text-zinc-600 hover:text-white transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <span className="text-[10px] font-bold text-[#8561EF] uppercase tracking-widest block mb-2">Historical Entry</span>
                            <h2 className="text-2xl font-bold tracking-tight">{selectedItem.name}</h2>
                            <p className="text-zinc-500 text-sm mt-1">{selectedItem.duration} total interaction length</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2">Record Summary</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{selectedItem.summary}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
