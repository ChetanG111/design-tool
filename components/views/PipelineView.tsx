'use client';

import React from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Search, Inbox } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { LoggedPipelineColumn } from '@/components/cards';
import { usePipelineData } from '@/lib/hooks';
import { MetricData } from '@/types';

export const PipelineView: React.FC = () => {
    const { pipelineData, metrics, isLoading } = usePipelineData();

    // Build metric cards from computed pipeline metrics (no fake values)
    const metricCards: MetricData[] = [
        { id: 'total', label: 'Active Conversations', value: metrics.totalActive.toString(), isPrimary: true },
        { id: 'engaged', label: 'Engaged', value: metrics.engaged.toString() },
        { id: 'qualified', label: 'Qualified', value: metrics.qualified.toString() },
        { id: 'closing', label: 'Closing', value: metrics.closing.toString() },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4 h-full overflow-hidden"
        >
            <header className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Conversation Pipeline</h1>
                    <p className="text-zinc-500 text-sm mt-1">Track logged conversations and outcomes</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#1E1E20] border border-white/5 rounded-2xl p-1.5 gap-1">
                        <button className="px-4 py-1.5 text-xs font-bold bg-[#8561EF] rounded-xl text-white shadow-lg transition-transform hover:scale-[1.02]">Pipeline View</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-zinc-600 hover:text-white transition-colors">List Analysis</button>
                    </div>
                    <button className="p-2.5 bg-[#1E1E20] border border-white/5 rounded-2xl text-zinc-600 hover:text-white transition-all">
                        <Search size={18} />
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-4 gap-4">
                <AnimatePresence mode="wait">
                    {metricCards.map((metric) => (
                        <MetricCard key={metric.id} metric={metric} />
                    ))}
                </AnimatePresence>
            </section>

            <section className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full">
                        <p className="text-zinc-600 text-sm">Loading pipeline...</p>
                    </div>
                ) : metrics.totalActive === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full py-16">
                        <div className="p-4 rounded-2xl bg-white/5 text-zinc-600 mb-4">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-400 mb-2">No Pipeline Items</h3>
                        <p className="text-sm text-zinc-600 text-center max-w-md">
                            Log actions with outcomes like &quot;Response received&quot; or &quot;Qualified intent&quot; to populate the pipeline.
                        </p>
                    </div>
                ) : (
                    <LayoutGroup>
                        {pipelineData.map((stage) => (
                            <LoggedPipelineColumn key={stage.id} stage={stage} />
                        ))}
                    </LayoutGroup>
                )}
            </section>
        </motion.div>
    );
};
