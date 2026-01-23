'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useMatricesData } from '@/lib/hooks';
import {
    MatrixSection,
    TIME_RETURN_COLUMNS,
    SENSE_MATRIX_COLUMNS,
    VALUE_DENSITY_COLUMNS,
} from '@/components/MatrixSection';

// Stat display - raw counts only, no percentages unless directly computed
const StatCell: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-[#1E1E20] rounded-2xl border border-white/5 p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">{label}</p>
        <p className="text-2xl font-bold text-zinc-200 mt-1">{value}</p>
    </div>
);

export const MatricesView: React.FC = () => {
    const {
        timeReturnMatrix,
        senseMatrix,
        valueDensityMatrix,
        stats,
        isLoading,
    } = useMatricesData();

    // Format revenue for display
    const formatRevenue = (cents: number): string => {
        if (cents === 0) return '—';
        return `$${(cents / 100).toLocaleString()}`;
    };

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            <header className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Matrices</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        What is actually worth your time — derived only from logged actions
                    </p>
                </div>
            </header>

            {/* Stats row - raw counts from logged data */}
            <section className="grid grid-cols-4 gap-4">
                <StatCell label="Actions Logged" value={isLoading ? '...' : stats.totalActions} />
                <StatCell label="Outcomes" value={isLoading ? '...' : stats.totalOutcomes} />
                <StatCell label="Leads" value={isLoading ? '...' : stats.totalLeads} />
                <StatCell label="Revenue" value={isLoading ? '...' : formatRevenue(stats.totalRevenue)} />
            </section>

            {/* Matrix tables - tables first, minimal interaction */}
            <motion.div
                className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Time → Return Matrix */}
                <MatrixSection
                    title="Time → Return"
                    subtitle="Actions logged, time spent, outcomes produced, revenue — return per unit time"
                    columns={TIME_RETURN_COLUMNS}
                    data={timeReturnMatrix}
                    emptyMessage="Log actions to see time-to-return analysis."
                />

                {/* Sense Matrix (Quality Check) */}
                <MatrixSection
                    title="Sense Matrix"
                    subtitle="Quality check — ICP clarity, problem clarity, outcome (descriptive, not scored)"
                    columns={SENSE_MATRIX_COLUMNS}
                    data={senseMatrix}
                    emptyMessage="Log actions to see quality breakdown."
                />

                {/* Value Density Matrix */}
                <MatrixSection
                    title="Value Density"
                    subtitle="Pure comparison — channel, surface, action type vs actions, leads, revenue"
                    columns={VALUE_DENSITY_COLUMNS}
                    data={valueDensityMatrix}
                    emptyMessage="Log actions to see value distribution."
                />
            </motion.div>
        </div>
    );
};
