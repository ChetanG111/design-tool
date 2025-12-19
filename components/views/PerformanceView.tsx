'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, MoreVertical, Lock, Globe } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { CHANNELS_METRICS, CHANNELS_DATA } from '@/lib/constants';

export const PerformanceView: React.FC = () => {
    const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <header className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Channel Analysis</h1>
                    <p className="text-zinc-500 text-sm mt-1">Optimizing outbound effort distribution</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1E1E20] border border-white/5 rounded-2xl text-xs font-bold text-zinc-500 hover:text-white hover:border-white/10 transition-all">
                        <Zap size={14} className="text-[#E3FF93]" />
                        Optimize Effort
                    </button>
                    <button className="p-2 bg-[#1E1E20] border border-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4">
                {CHANNELS_METRICS.map((metric) => (
                    <MetricCard key={metric.id} metric={metric} />
                ))}
            </section>

            <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
                <div className="col-span-8 bg-[#1E1E20] rounded-3xl border border-white/5 p-8 relative overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-lg font-bold tracking-tight">Relative Efficacy</h2>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Past 30 Days</span>
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#8561EF]" /> Active Channels</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 top-20 px-8 pb-12">
                        <svg width="100%" height="100%" viewBox="0 0 900 200" preserveAspectRatio="none" className="overflow-visible">
                            {[0, 50, 100, 150, 200].map(y => (
                                <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            ))}
                            {CHANNELS_DATA.map((ch) => (
                                <motion.path
                                    key={ch.id}
                                    d={ch.path}
                                    fill="none"
                                    stroke={ch.id === hoveredChannel ? "#8561EF" : "rgba(255,255,255,0.1)"}
                                    strokeWidth={ch.id === hoveredChannel ? 3 : 1.5}
                                    initial={{ pathLength: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: hoveredChannel ? (ch.id === hoveredChannel ? 1 : 0.3) : 1
                                    }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                />
                            ))}
                        </svg>
                    </div>
                </div>
                <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-[#1E1E20]/60 rounded-3xl border border-white/5 p-6 flex flex-col overflow-hidden shadow-2xl">
                        <h2 className="text-lg font-bold mb-6 tracking-tight">Effort Distribution</h2>
                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                            {CHANNELS_DATA.map((ch) => (
                                <motion.div
                                    key={ch.id}
                                    onHoverStart={() => setHoveredChannel(ch.id)}
                                    onHoverEnd={() => setHoveredChannel(null)}
                                    whileHover={{ x: 4 }}
                                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${hoveredChannel === ch.id
                                            ? 'bg-[#8561EF]/10 border-[#8561EF]/40'
                                            : 'bg-[#1E1E20] border-white/5'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${ch.id === hoveredChannel ? 'bg-[#8561EF] text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                                                {ch.type === 'Private' ? <Lock size={12} /> : <Globe size={12} />}
                                            </div>
                                            <span className="text-sm font-semibold">{ch.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Efficacy Score</p>
                                            <h4 className="text-lg font-bold">{ch.score}%</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Volume</p>
                                            <p className="text-xs font-bold text-zinc-400">{ch.volume}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
