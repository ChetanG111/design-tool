'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Send,
    MessageSquare,
    MessageCircle,
    Clock,
    Globe,
    Lock,
    Check
} from 'lucide-react';

// Action types with their icons and labels
const ACTION_TYPES = [
    { id: 'dm', label: 'DM', icon: Send, showsOutcome: true },
    { id: 'post', label: 'Post', icon: MessageSquare, showsOutcome: false },
    { id: 'comment', label: 'Comment', icon: MessageCircle, showsOutcome: true },
    { id: 'followup', label: 'Follow-up', icon: Clock, showsOutcome: true },
] as const;

// Channel options
const CHANNELS = [
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'email', label: 'Email' },
    { id: 'reddit', label: 'Reddit' },
] as const;

// Outcome options - what happened as a result
const OUTCOMES = [
    { id: 'response', label: 'Response received', isFinal: false },
    { id: 'qualified', label: 'Qualified intent', isFinal: false },
    { id: 'next-step', label: 'Next step scheduled', isFinal: false },
    { id: 'closed-won', label: 'Closed / Won', isFinal: true },
    { id: 'closed-lost', label: 'Closed / Lost', isFinal: true },
] as const;

// Spring configurations matching app design system
const panelSpring = {
    type: 'spring' as const,
    stiffness: 280,
    damping: 32,
};

const overlaySpring = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 40,
};

const buttonSpring = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
};

type ActionType = typeof ACTION_TYPES[number]['id'];
type ChannelType = typeof CHANNELS[number]['id'];
type OutcomeType = typeof OUTCOMES[number]['id'];

interface LogActionOverlayProps {
    className?: string;
}

export const LogActionOverlay: React.FC<LogActionOverlayProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [note, setNote] = useState('');
    const [selectedOutcome, setSelectedOutcome] = useState<OutcomeType | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Determine if outcome section should be visible
    const showOutcomeSection = selectedAction ?
        ACTION_TYPES.find(a => a.id === selectedAction)?.showsOutcome ?? false : false;

    const handleClose = useCallback(() => {
        setIsOpen(false);
        // Reset state after animation completes
        setTimeout(() => {
            setSelectedAction(null);
            setSelectedChannel(null);
            setIsPrivate(false);
            setNote('');
            setSelectedOutcome(null);
            setIsSubmitted(false);
        }, 300);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!selectedAction) return;

        try {
            // POST to API to log the action
            const response = await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionType: selectedAction,
                    channel: selectedChannel,
                    surface: isPrivate ? 'private' : 'public',
                    note: note.trim(),
                    outcome: selectedOutcome,
                }),
            });

            if (!response.ok) throw new Error('Failed to log action');

            // Show success state
            setIsSubmitted(true);

            // Auto-close after brief pause
            setTimeout(() => {
                handleClose();
            }, 800);
        } catch (error) {
            console.error('Failed to log action:', error);
            // Could add error state handling here
        }
    }, [selectedAction, selectedChannel, isPrivate, note, handleClose]);

    // Keyboard shortcut: Ctrl+L to open/close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    return (
        <>
            {/* Floating Action Button - Fixed Position */}
            <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ ...buttonSpring, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8561EF] to-[#E4DBFF] flex items-center justify-center shadow-[0_8px_32px_rgba(133,97,239,0.4)] hover:shadow-[0_12px_48px_rgba(133,97,239,0.5)] transition-shadow group ${className}`}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={buttonSpring}
                >
                    <Plus size={24} className="text-[#131313]" strokeWidth={2.5} />
                </motion.div>

                {/* Pulse ring animation */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#8561EF]"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.button>

            {/* Overlay and Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Background Dimmer */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={handleClose}
                            className="fixed inset-0 z-[60] bg-black/40"
                        />

                        {/* Slide-over Panel */}
                        <motion.div
                            key="panel"
                            initial={{ x: '100%', opacity: 0.8 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0.8 }}
                            transition={panelSpring}
                            className="fixed right-4 top-4 z-[70] w-full max-w-sm"
                        >
                            <div className="bg-[#1E1E20] rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ ...overlaySpring, delay: 0.1 }}
                                            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8561EF] to-[#E4DBFF] flex items-center justify-center shadow-[0_0_20px_rgba(133,97,239,0.3)]"
                                        >
                                            <Plus size={18} className="text-[#131313]" strokeWidth={2.5} />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15 }}
                                        >
                                            <h2 className="text-lg font-bold tracking-tight">Log Action</h2>
                                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
                                                Quick capture
                                            </p>
                                        </motion.div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={buttonSpring}
                                        onClick={handleClose}
                                        className="p-2 rounded-xl text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                                    {/* Action Type Selection */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                            Action Type
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {ACTION_TYPES.map((action, index) => {
                                                const Icon = action.icon;
                                                const isSelected = selectedAction === action.id;
                                                return (
                                                    <motion.button
                                                        key={action.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ ...overlaySpring, delay: 0.15 + index * 0.05 }}
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedAction(action.id)}
                                                        className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 aspect-square ${isSelected
                                                            ? 'bg-[#8561EF]/15 border-[#8561EF]/40 text-[#8561EF]'
                                                            : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/10 hover:bg-white/[0.04]'
                                                            }`}
                                                    >
                                                        <Icon size={20} className="flex-shrink-0" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                                                            {action.label}
                                                        </span>
                                                        {isSelected && (
                                                            <motion.div
                                                                layoutId="action-indicator"
                                                                className="absolute inset-0 rounded-2xl border-2 border-[#8561EF]"
                                                                transition={panelSpring}
                                                            />
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.section>

                                    {/* Channel Selection */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                            Channel
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {CHANNELS.map((channel, index) => {
                                                const isSelected = selectedChannel === channel.id;
                                                return (
                                                    <motion.button
                                                        key={channel.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.25 + index * 0.04 }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setSelectedChannel(channel.id)}
                                                        className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors duration-200 ${isSelected
                                                            ? 'border-transparent text-[#E3FF93]'
                                                            : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                                                            }`}
                                                    >
                                                        <span className="relative z-10">{channel.label}</span>
                                                        {isSelected && (
                                                            <motion.div
                                                                layoutId="channel-indicator"
                                                                className="absolute inset-0 rounded-xl bg-[#E3FF93]/15 border-2 border-[#E3FF93]/40"
                                                                transition={panelSpring}
                                                            />
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.section>

                                    {/* Surface Toggle */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                            Surface
                                        </label>
                                        <div className="relative flex p-1.5 bg-white/[0.02] rounded-2xl border border-white/5 w-fit">
                                            {/* Sliding background indicator */}
                                            <motion.div
                                                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-0.375rem)] bg-gradient-to-r from-[#8561EF] to-[#a78bfa] rounded-xl shadow-[0_4px_16px_rgba(133,97,239,0.35)]"
                                                initial={false}
                                                animate={{ x: isPrivate ? 'calc(100% + 0.375rem)' : 0 }}
                                                transition={panelSpring}
                                            />
                                            <button
                                                onClick={() => setIsPrivate(false)}
                                                className={`relative z-10 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${!isPrivate
                                                    ? 'text-white'
                                                    : 'text-zinc-500 hover:text-zinc-300'
                                                    }`}
                                            >
                                                <Globe size={14} />
                                                <span>Public</span>
                                            </button>
                                            <button
                                                onClick={() => setIsPrivate(true)}
                                                className={`relative z-10 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 ${isPrivate
                                                    ? 'text-white'
                                                    : 'text-zinc-500 hover:text-zinc-300'
                                                    }`}
                                            >
                                                <Lock size={14} />
                                                <span>Private</span>
                                            </button>
                                        </div>
                                    </motion.section>

                                    {/* Optional Note */}
                                    <motion.section
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                            Note <span className="text-zinc-700">(Optional)</span>
                                        </label>
                                        <motion.textarea
                                            whileFocus={{ scale: 1.01 }}
                                            transition={{ duration: 0.2 }}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Quick context or details..."
                                            rows={2}
                                            maxLength={140}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-white placeholder-zinc-700 resize-none focus:border-[#8561EF]/40 focus:bg-white/[0.04] focus:outline-none transition-all"
                                        />
                                        <div className="flex justify-end mt-2">
                                            <span className="text-[10px] text-zinc-700 font-medium">
                                                {note.length}/140
                                            </span>
                                        </div>
                                    </motion.section>

                                    {/* Outcome Section (Conditional) */}
                                    <AnimatePresence>
                                        {showOutcomeSection && (
                                            <motion.section
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={panelSpring}
                                                className="overflow-hidden"
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">
                                                        Outcome <span className="text-zinc-700">(Optional)</span>
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {OUTCOMES.map((outcome, index) => {
                                                            const isSelected = selectedOutcome === outcome.id;
                                                            const isFinal = outcome.isFinal;
                                                            return (
                                                                <motion.button
                                                                    key={outcome.id}
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ ...overlaySpring, delay: index * 0.03 }}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => setSelectedOutcome(isSelected ? null : outcome.id)}
                                                                    className={`relative px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all duration-200 ${isSelected
                                                                            ? isFinal
                                                                                ? 'border-transparent text-white'
                                                                                : 'border-transparent text-[#E3FF93]'
                                                                            : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
                                                                        }`}
                                                                >
                                                                    <span className="relative z-10">{outcome.label}</span>
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            layoutId="outcome-indicator"
                                                                            className={`absolute inset-0 rounded-xl border-2 ${isFinal
                                                                                    ? 'bg-zinc-700/50 border-zinc-600/60'
                                                                                    : 'bg-[#E3FF93]/15 border-[#E3FF93]/40'
                                                                                }`}
                                                                            transition={panelSpring}
                                                                        />
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            </motion.section>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-6 pt-4 border-t border-white/5"
                                >
                                    <motion.button
                                        whileHover={!isSubmitted ? { scale: 1.01, y: -1 } : {}}
                                        whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                                        transition={buttonSpring}
                                        disabled={!selectedAction || isSubmitted}
                                        onClick={handleSubmit}
                                        className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitted
                                            ? 'bg-emerald-500/90 text-white shadow-[0_8px_32px_rgba(16,185,129,0.3)]'
                                            : selectedAction
                                                ? 'bg-gradient-to-r from-[#8561EF] to-[#a78bfa] text-white shadow-[0_8px_32px_rgba(133,97,239,0.3)] hover:shadow-[0_12px_48px_rgba(133,97,239,0.4)]'
                                                : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSubmitted ? (
                                                <motion.div
                                                    key="success"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={buttonSpring}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                    <span>Logged</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="default"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Send size={16} />
                                                    <span>Log Action</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    {/* Keyboard shortcut hint */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center justify-center gap-2 mt-4"
                                    >
                                        <div className="flex gap-1">
                                            <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-600">
                                                Ctrl
                                            </kbd>
                                            <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-600">
                                                L
                                            </kbd>
                                        </div>
                                        <span className="text-[10px] text-zinc-700 uppercase font-medium tracking-wider">
                                            Quick log
                                        </span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default LogActionOverlay;
