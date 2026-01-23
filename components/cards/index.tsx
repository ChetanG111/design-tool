'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, MessageCircle, Clock, ArrowUpRight, MoreHorizontal, Globe, Lock } from 'lucide-react';
import { LoggedAction } from '@/types';
import { springConfig, ACTION_TYPE_DISPLAY, CHANNEL_DISPLAY } from '@/lib/constants';
import { formatRelativeTime, PipelineItem, PipelineStageData } from '@/lib/hooks';

// Logged Action Row Component - displays logged actions in Recent Activity
interface LoggedActionRowProps {
    action: LoggedAction;
    index: number;
    onMarkComplete?: (id: string) => void;
}

export const LoggedActionRow: React.FC<LoggedActionRowProps> = ({ action, index, onMarkComplete }) => {
    const display = ACTION_TYPE_DISPLAY[action.actionType];
    const channelName = action.channel ? CHANNEL_DISPLAY[action.channel] : 'Unknown';

    const getIcon = () => {
        switch (action.actionType) {
            case 'dm': return <Send size={18} />;
            case 'post': return <MessageSquare size={18} />;
            case 'comment': return <MessageCircle size={18} />;
            case 'followup': return <Clock size={18} />;
        }
    };

    const statusColors = {
        'logged': 'text-[#8561EF]/90 border-[#8561EF]/10',
        'needs-followup': 'text-amber-500/90 border-amber-500/10',
        'completed': 'text-emerald-500/90 border-emerald-500/10',
    };

    const statusDotColors = {
        'logged': 'bg-[#8561EF] shadow-[0_0_8px_rgba(133,97,239,0.4)]',
        'needs-followup': 'bg-amber-500 animate-pulse',
        'completed': 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: index * 0.04 }}
            className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-transform group-hover:scale-105 shadow-sm ${display.type === 'outbound' ? 'bg-[#8561EF]/10 text-[#8561EF]' :
                    display.type === 'reply' ? 'bg-[#E3FF93]/10 text-[#E3FF93]' : 'bg-white/10 text-white'
                    }`}>
                    {getIcon()}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm group-hover:text-white transition-colors">{display.label}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="text-xs text-zinc-400 font-medium">{channelName}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                            {action.surface === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                            {action.surface}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{formatRelativeTime(action.createdAt)}</span>
                        {action.note && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <p className="text-xs text-zinc-600 line-clamp-1">{action.note}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/5 bg-black/20 ${statusColors[action.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[action.status]}`} />
                    {action.status.replace('-', ' ')}
                </div>
                {action.status !== 'completed' && onMarkComplete && (
                    <button
                        onClick={() => onMarkComplete(action.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-500 transition-all"
                    >
                        <ArrowUpRight size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// Pending Action Card - for Next Actions panel
interface PendingActionCardProps {
    action: LoggedAction;
    index: number;
    onMarkComplete?: (id: string) => void;
}

export const PendingActionCard: React.FC<PendingActionCardProps> = ({ action, index, onMarkComplete }) => {
    const display = ACTION_TYPE_DISPLAY[action.actionType];
    const channelName = action.channel ? CHANNEL_DISPLAY[action.channel] : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springConfig, delay: index * 0.05 }}
            className="p-5 rounded-2xl bg-[#1E1E20] border border-white/5 flex flex-col gap-3 group hover:bg-[#252528] hover:border-white/10 transition-all duration-300 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <div className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border bg-amber-400/10 border-amber-400/20 text-amber-400">
                    Follow-up
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">{formatRelativeTime(action.createdAt)}</span>
                </div>
            </div>
            <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white leading-snug transition-colors">
                {display.label}{channelName ? ` on ${channelName}` : ''}
            </h4>
            {action.note && (
                <p className="text-xs text-zinc-500 line-clamp-2">{action.note}</p>
            )}

            <div className="flex justify-end mt-1">
                {onMarkComplete && (
                    <button
                        onClick={() => onMarkComplete(action.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-[#8561EF] rounded-lg text-white transition-all transform group-hover:translate-x-0 translate-x-2"
                    >
                        <ArrowUpRight size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// Legacy exports for backward compatibility (other views might use these)
export { LoggedActionRow as ActivityRow };
export { PendingActionCard as FollowUpCard };

// Pipeline Card Component - Now driven by logged actions

interface LoggedPipelineCardProps {
    item: PipelineItem;
}

export const LoggedPipelineCard: React.FC<LoggedPipelineCardProps> = ({ item }) => {
    // Activity health based on days since activity
    const getHealthIndicator = () => {
        if (item.status === 'stalled') return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
        if (item.daysSinceActivity >= 3) return 'bg-amber-500';
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ translateY: -4 }}
            transition={springConfig}
            className="bg-[#1E1E20] border border-white/5 p-4 rounded-2xl shadow-xl hover:border-white/10 transition-colors group cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{item.target}</h4>
                    <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mt-0.5">
                        {item.outcome ? item.outcome.replace('-', ' ') : 'Response received'}
                    </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${getHealthIndicator()}`} />
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{item.lastAction}</p>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">{formatRelativeTime(item.lastActivityTime)}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase">
                    <Clock size={10} />
                    <span>{item.daysSinceActivity}d</span>
                </div>
            </div>
        </motion.div>
    );
};

// Pipeline Column Component - Now driven by logged actions
interface LoggedPipelineColumnProps {
    stage: PipelineStageData;
}

export const LoggedPipelineColumn: React.FC<LoggedPipelineColumnProps> = ({ stage }) => (
    <div className="flex-shrink-0 w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stage.label}</h3>
                <span className="text-[10px] font-bold bg-white/5 text-zinc-600 px-2 py-0.5 rounded-full">
                    {stage.items.length}
                </span>
            </div>
            <button className="text-zinc-700 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
            </button>
        </div>
        <div className="flex-1 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar p-3 pr-2 space-y-3">
                {stage.items.length > 0 ? (
                    stage.items.map((item) => (
                        <LoggedPipelineCard key={item.id} item={item} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-[10px] text-zinc-700 uppercase tracking-widest">No items</p>
                        <p className="text-[10px] text-zinc-800 mt-1">Log actions to populate</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// Keep legacy exports for backward compatibility
export { LoggedPipelineCard as PipelineCard };
export { LoggedPipelineColumn as PipelineColumn };
