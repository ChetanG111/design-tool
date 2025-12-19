'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, BarChart3, Clock, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { ActivityItem, FollowUpItem, PipelineCard as PipelineCardType, PipelineStage as PipelineStageType } from '@/types';
import { springConfig } from '@/lib/constants';

// Activity Row Component
interface ActivityRowProps {
    item: ActivityItem;
    index: number;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springConfig, delay: index * 0.04 }}
        className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
    >
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 shadow-sm ${item.type === 'outbound' ? 'bg-[#8561EF]/10 text-[#8561EF]' :
                item.type === 'reply' ? 'bg-[#E3FF93]/10 text-[#E3FF93]' : 'bg-white/10 text-white'
                }`}>
                {item.type === 'outbound' ? <Send size={18} /> : item.type === 'reply' ? <MessageSquare size={18} /> : <BarChart3 size={18} />}
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm group-hover:text-white transition-colors">{item.target}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-xs text-zinc-500 font-medium">{item.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-1">{item.detail}</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5 bg-black/20 ${item.status === 'completed' ? 'text-emerald-500/90 border-emerald-500/10' :
                item.status === 'active' ? 'text-amber-500/90 border-amber-500/10' : 'text-zinc-600 border-zinc-500/10'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                    item.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-700'
                    }`} />
                {item.status}
            </div>
        </div>
    </motion.div>
);

// Follow Up Card Component
interface FollowUpCardProps {
    item: FollowUpItem;
    index: number;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springConfig, delay: index * 0.05 }}
        className="p-5 rounded-2xl bg-[#1E1E20] border border-white/5 flex flex-col gap-3 group hover:bg-[#252528] hover:border-white/10 transition-all duration-300 shadow-sm"
    >
        <div className="flex items-center justify-between">
            <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${item.priority === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                item.priority === 'medium' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' : 'bg-zinc-800 border-white/5 text-zinc-500'
                }`}>
                {item.priority}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.due}</span>
            </div>
        </div>
        <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white leading-snug transition-colors">{item.title}</h4>

        <div className="flex justify-end mt-1">
            <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#8561EF] rounded-lg text-white transition-all transform group-hover:translate-x-0 translate-x-2">
                <ArrowUpRight size={14} />
            </button>
        </div>
    </motion.div>
);

// Pipeline Card Component
interface PipelineCardProps {
    card: PipelineCardType;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ card }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ translateY: -4 }}
        transition={springConfig}
        className="bg-[#1E1E20] border border-white/5 p-4 rounded-2xl shadow-xl hover:border-white/10 transition-colors group cursor-grab active:cursor-grabbing"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
                <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{card.title}</h4>
                <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{card.subtitle}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${card.health === 'good' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                card.health === 'neutral' ? 'bg-amber-500' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                }`} />
        </div>
        <div className="flex items-end justify-between">
            <span className="text-lg font-bold text-[#8561EF]">{card.value}</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase">
                <Clock size={10} />
                <span>{card.days}d</span>
            </div>
        </div>
    </motion.div>
);

// Pipeline Column Component
interface PipelineColumnProps {
    stage: PipelineStageType;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage }) => (
    <div className="flex-shrink-0 w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stage.label}</h3>
                <span className="text-[10px] font-bold bg-white/5 text-zinc-600 px-2 py-0.5 rounded-full">
                    {stage.cards.length}
                </span>
            </div>
            <button className="text-zinc-700 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
            </button>
        </div>
        <div className="flex-1 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar p-3 pr-2 space-y-3">
                {stage.cards.map((card) => (
                    <PipelineCard key={card.id} card={card} />
                ))}
                <button className="w-full py-3 rounded-2xl border border-dashed border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 hover:text-zinc-500 hover:border-white/10 transition-all">
                    + Add Target
                </button>
            </div>
        </div>
    </div>
);
