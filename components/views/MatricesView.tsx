'use client';

import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { MatrixSection } from '@/components/MatrixSection';
import { MATRICES_METRICS, MATRIX_ROI_DATA, MATRIX_DENSITY_DATA } from '@/lib/constants';

export const MatricesView: React.FC = () => (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
        <header className="flex justify-between items-center py-2">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">Strategy Matrices</h1>
                <p className="text-zinc-500 text-sm mt-1">Empirical evaluation of outbound vectors</p>
            </div>
        </header>
        <section className="grid grid-cols-4 gap-4">
            {MATRICES_METRICS.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </section>
        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pb-10">
            <MatrixSection
                title="ROI by Outreach Vector"
                subtitle="Analyzing conversion vs. resource expenditure per touchpoint"
                data={MATRIX_ROI_DATA}
            />
            <MatrixSection
                title="Target Segment Density"
                subtitle="Value concentration and cycle duration by market tier"
                data={MATRIX_DENSITY_DATA}
            />
        </div>
    </div>
);
