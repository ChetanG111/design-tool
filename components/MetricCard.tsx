'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, ArrowUpRight } from 'lucide-react';
import { MetricData } from '@/types';
import { springConfig } from '@/lib/constants';

interface MetricCardProps {
    metric: MetricData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => (
    <motion.div
        whileHover={{ translateY: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={springConfig}
        className={`p-5 rounded-3xl border border-white/5 h-full relative overflow-hidden group transition-colors hover:border-white/10 ${metric.isPrimary ? 'bg-[#8561EF] shadow-[0_20px_40px_rgba(133,97,239,0.15)]' : 'bg-[#1E1E20]'
            }`}
    >
        {metric.isPrimary && (
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 blur-3xl rounded-full" />
        )}

        <div className="flex justify-between items-start mb-6">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${metric.isPrimary ? 'text-white/70' : 'text-zinc-600'}`}>
                {metric.label}
            </span>
            <button className={`p-1 rounded-lg hover:bg-white/5 transition-colors ${metric.isPrimary ? 'text-white/60' : 'text-zinc-700'}`}>
                <MoreVertical size={14} />
            </button>
        </div>

        <div className="flex items-end justify-between">
            <div>
                <h3 className={`text-3xl font-bold tracking-tight ${metric.isPrimary ? 'text-white' : 'text-white'}`}>
                    {metric.value}
                </h3>
            </div>
            {metric.isPrimary && (
                <div className="p-2 bg-white/10 rounded-xl">
                    <ArrowUpRight size={20} className="text-white" />
                </div>
            )}
        </div>
    </motion.div>
);
