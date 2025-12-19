'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Layers,
    BarChart3,
    Grid,
    Archive,
    Settings,
    Send
} from 'lucide-react';
import { SidebarItem } from '@/components/SidebarItem';
import { ViewSkeleton } from '@/components/ui/Skeleton';
import {
    TodayView,
    PipelineView,
    PerformanceView,
    MatricesView,
    ArchiveView,
    SettingsView
} from '@/components/views';
import { springConfig } from '@/lib/constants';

type ViewType = 'today' | 'pipeline' | 'performance' | 'matrices' | 'archive' | 'settings';

export default function Dashboard() {
    const [activeView, setActiveView] = useState<ViewType>('today');
    const [isViewLoading, setIsViewLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleViewChange = (view: ViewType) => {
        if (view === activeView) return;
        setIsViewLoading(true);
        setActiveView(view);
        setTimeout(() => {
            setIsViewLoading(false);
        }, 450);
    };

    return (
        <div className="flex h-screen bg-[#131313] text-white p-4 gap-4 overflow-hidden selection:bg-[#8561EF]/30 selection:text-white">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarCollapsed ? '88px' : '256px' }}
                transition={springConfig}
                className="bg-[#1E1E20]/40 rounded-3xl border border-white/5 flex flex-col p-6 overflow-hidden relative shadow-2xl"
            >
                <motion.div
                    layout
                    transition={springConfig}
                    className="flex items-center mb-10 h-8 w-full"
                    style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
                >
                    <motion.button
                        layout
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={springConfig}
                        className="flex items-center gap-2 flex-shrink-0 cursor-pointer focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8561EF] to-[#E4DBFF] flex items-center justify-center shadow-[0_0_15px_rgba(133,97,239,0.3)] flex-shrink-0">
                            <Send size={16} className="text-[#131313]" />
                        </div>
                        <AnimatePresence>
                            {!isSidebarCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-bold text-lg tracking-tight uppercase whitespace-nowrap overflow-hidden"
                                >
                                    Operator
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>

                <nav className="space-y-1 mb-10 flex-1">
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        label="Today"
                        active={activeView === 'today'}
                        onClick={() => handleViewChange('today')}
                        collapsed={isSidebarCollapsed}
                    />
                    <SidebarItem
                        icon={<Layers size={20} />}
                        label="Pipeline"
                        active={activeView === 'pipeline'}
                        onClick={() => handleViewChange('pipeline')}
                        collapsed={isSidebarCollapsed}
                    />
                    <SidebarItem
                        icon={<BarChart3 size={20} />}
                        label="Performance"
                        active={activeView === 'performance'}
                        onClick={() => handleViewChange('performance')}
                        collapsed={isSidebarCollapsed}
                    />
                    <SidebarItem
                        icon={<Grid size={20} />}
                        label="Matrices"
                        active={activeView === 'matrices'}
                        onClick={() => handleViewChange('matrices')}
                        collapsed={isSidebarCollapsed}
                    />
                    <SidebarItem
                        icon={<Archive size={20} />}
                        label="Archive"
                        active={activeView === 'archive'}
                        onClick={() => handleViewChange('archive')}
                        collapsed={isSidebarCollapsed}
                    />
                </nav>

                <div className="mt-auto space-y-1">
                    <SidebarItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={activeView === 'settings'}
                        onClick={() => handleViewChange('settings')}
                        collapsed={isSidebarCollapsed}
                    />

                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-3 px-2 group cursor-pointer transition-all hover:opacity-80">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 overflow-hidden group-hover:border-[#8561EF]/40 transition-colors flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://picsum.photos/100/100?grayscale" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <AnimatePresence>
                            {!isSidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                    className="flex flex-col whitespace-nowrap overflow-hidden"
                                >
                                    <span className="text-sm font-semibold leading-tight text-zinc-300">Alex Rivera</span>
                                    <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Operator Tier 1</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <motion.main
                layout
                transition={springConfig}
                className="flex-1 overflow-hidden relative"
            >
                <AnimatePresence mode="wait">
                    {isViewLoading ? (
                        <motion.div
                            key="loading-skeleton"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <ViewSkeleton />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeView}
                            className="h-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {activeView === 'today' && <TodayView />}
                            {activeView === 'pipeline' && <PipelineView />}
                            {activeView === 'performance' && <PerformanceView />}
                            {activeView === 'matrices' && <MatricesView />}
                            {activeView === 'archive' && <ArchiveView />}
                            {activeView === 'settings' && <SettingsView />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
