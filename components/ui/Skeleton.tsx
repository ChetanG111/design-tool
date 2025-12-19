'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
    <div className={`bg-white/[0.03] rounded-2xl shimmer-bg ${className}`} />
);

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-3xl text-zinc-600 mb-6">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-300">{title}</h3>
        <p className="text-sm text-zinc-500 max-w-xs mt-2 leading-relaxed">{subtitle}</p>
    </motion.div>
);

export const ViewSkeleton: React.FC = () => (
    <div className="flex flex-col gap-4 h-full animate-pulse">
        <div className="flex justify-between items-center py-2">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="flex-1 grid grid-cols-12 gap-4">
            <Skeleton className="col-span-8 h-full" />
            <Skeleton className="col-span-4 h-full" />
        </div>
    </div>
);
