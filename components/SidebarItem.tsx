'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { snappySpring } from '@/lib/constants';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    collapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ x: collapsed ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        transition={snappySpring}
        title={collapsed ? label : undefined}
        className={`flex items-center gap-3 py-2.5 rounded-xl w-full transition-colors duration-200 group relative overflow-hidden
            ${collapsed ? 'justify-center' : 'justify-start'}
            ${active ? 'text-[#8561EF]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
        `}
    >
        <span className={`flex-shrink-0 transition-colors duration-300 ${active ? 'text-[#8561EF]' : 'group-hover:text-white/80'}`}>{icon}</span>

        <AnimatePresence mode="wait">
            {!collapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`text-sm font-medium tracking-tight whitespace-nowrap ${active ? 'text-[#8561EF]' : ''}`}
                >
                    {label}
                </motion.span>
            )}
        </AnimatePresence>
    </motion.button>
);
