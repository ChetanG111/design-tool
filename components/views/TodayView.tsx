'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Zap, AlertCircle } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { ActivityRow, FollowUpCard } from '@/components/cards';
import { EmptyState } from '@/components/ui/Skeleton';
import { MOCK_METRICS, MOCK_ACTIVITY, MOCK_FOLLOW_UPS, springConfig } from '@/lib/constants';

export const TodayView: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-4 overflow-hidden h-full"
    >
        <header className="flex justify-between items-center py-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">Execution Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">Real-time outbound performance oversight</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-[#8561EF]" size={18} />
                    <input
                        type="text"
                        placeholder="Search targets..."
                        className="bg-[#1E1E20] border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#8561EF]/50 focus:bg-[#252528] transition-all w-64"
                    />
                </div>
                <button className="p-2.5 bg-[#1E1E20] border border-white/5 rounded-2xl text-zinc-500 hover:text-white hover:border-white/10 transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#8561EF] rounded-full border border-[#131313]" />
                </button>
            </div>
        </header>

        <section className="grid grid-cols-5 gap-4">
            {MOCK_METRICS.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </section>

        <section className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">
            <div className="col-span-8 bg-[#1E1E20] rounded-3xl border border-white/5 flex flex-col overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Auto-refresh active</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
                    {MOCK_ACTIVITY.length > 0 ? (
                        MOCK_ACTIVITY.map((item, idx) => (
                            <ActivityRow key={item.id} item={item} index={idx} />
                        ))
                    ) : (
                        <EmptyState
                            icon={<Zap size={32} />}
                            title="No Recent Activity"
                            subtitle="System is ready but no actions have been logged in the current window."
                        />
                    )}
                </div>
            </div>

            <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 bg-[#1E1E20]/60 rounded-3xl border border-white/5 p-6 flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold tracking-tight">Execution Plan</h2>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                            View Schedule
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                        {MOCK_FOLLOW_UPS.map((item, idx) => (
                            <FollowUpCard key={item.id} item={item} index={idx} />
                        ))}
                    </div>
                </div>

                <div className="h-40 bg-gradient-to-br from-[#1E1E20] to-[#252528] rounded-3xl border border-white/5 p-6 relative overflow-hidden flex flex-col justify-end group transition-colors hover:border-white/10 shadow-2xl">
                    <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-600 group-hover:text-[#E3FF93] transition-colors">
                        <AlertCircle size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Queue Status</span>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight">Optimal</h3>
                        <span className="text-2xl font-bold text-[#E3FF93]">88%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '88%' }}
                            transition={{ ...springConfig, delay: 0.5 }}
                            className="h-full bg-[#E3FF93] shadow-[0_0_10px_rgba(227,255,147,0.3)]"
                        />
                    </div>
                </div>
            </div>
        </section>
    </motion.div>
);
