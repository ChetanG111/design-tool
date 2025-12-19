'use client';

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Search } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { PipelineColumn } from '@/components/cards';
import { PIPELINE_METRICS, PIPELINE_DATA } from '@/lib/constants';

export const PipelineView: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-4 h-full overflow-hidden"
    >
        <header className="flex justify-between items-center py-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">Deal Pipeline</h1>
                <p className="text-zinc-500 text-sm mt-1">Monitor and advance high-intent opportunities</p>
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
            {PIPELINE_METRICS.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </section>

        <section className="flex-1 flex gap-4 overflow-x-auto pb-4 pt-2 custom-scrollbar">
            <LayoutGroup>
                {PIPELINE_DATA.map((stage) => (
                    <PipelineColumn key={stage.id} stage={stage} />
                ))}
            </LayoutGroup>
        </section>
    </motion.div>
);
