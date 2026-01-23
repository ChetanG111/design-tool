'use client';

import React, { useState } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Activity, TrendingUp, Users, DollarSign, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePerformanceData, TimeRange, TimeSeriesData } from '@/lib/hooks';
import { springConfig } from '@/lib/constants';

// Color palette for graphs (no red/green judgment colors)
const GRAPH_COLORS = {
    actions: '#8561EF',    // Purple (accent)
    responses: '#61A0EF', // Blue
    leads: '#EF61C5',     // Pink
    revenue: '#E3FF93',   // Lime
    pipeline: '#61EFD4',  // Teal
};

// Time range options
const TIME_RANGES: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '14d', label: '14 days' },
    { value: '30d', label: '30 days' },
    { value: 'all', label: 'All time' },
];

// Icon mapping for each metric
const METRIC_ICONS = {
    actions: Activity,
    responses: TrendingUp,
    leads: Users,
    revenue: DollarSign,
    pipeline: Layers,
};

interface TrendGraphProps {
    series: TimeSeriesData;
    color: string;
    icon: React.ElementType;
    formatValue?: (value: number) => string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, color, formatValue }: {
    active?: boolean;
    payload?: readonly { payload: { value: number; date: string } }[];
    color: string;
    formatValue: (v: number) => string;
}) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    return (
        <div className="bg-[#131313] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
            <p className="text-xs font-bold" style={{ color }}>
                {formatValue(data.value)}
            </p>
            <p className="text-[10px] text-zinc-500">
                {new Date(data.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                })}
            </p>
        </div>
    );
};

// Individual trend graph component
const TrendGraph: React.FC<TrendGraphProps> = ({
    series,
    color,
    icon: Icon,
    formatValue = (v) => v.toString(),
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Transform data for Recharts
    const chartData = series.data.map((d) => ({
        date: d.date,
        value: d.value,
        // Format date for XAxis
        displayDate: new Date(d.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative bg-[#1E1E20] rounded-3xl border border-white/5 p-6 overflow-hidden group hover:border-white/10 transition-colors"
        >
            {/* Background glow on hover */}
            <motion.div
                className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: color }}
                animate={{ opacity: isHovered ? 0.1 : 0.03 }}
                transition={{ duration: 0.3 }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: `${color}20` }}
                    >
                        <Icon size={16} style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{series.label}</h3>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                            {series.data.length} days
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <motion.p
                        className="text-2xl font-bold"
                        style={{ color }}
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={springConfig}
                    >
                        {formatValue(series.total)}
                    </motion.p>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Total</p>
                </div>
            </div>

            {/* Graph */}
            <div className="h-28 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                            <linearGradient id={`gradient-${series.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="displayDate" hide />
                        <YAxis hide domain={[0, 'auto']} />
                        <Tooltip
                            content={(props) => (
                                <CustomTooltip
                                    {...props}
                                    color={color}
                                    formatValue={formatValue}
                                />
                            )}
                            cursor={{
                                stroke: color,
                                strokeWidth: 1,
                                strokeOpacity: 0.3,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#gradient-${series.id})`}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: color,
                                stroke: '#131313',
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Date range labels */}
            <div className="flex justify-between mt-2">
                <span className="text-[10px] text-zinc-600">
                    {series.data[0]?.date ? new Date(series.data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                </span>
                <span className="text-[10px] text-zinc-600">
                    {series.data[series.data.length - 1]?.date ? new Date(series.data[series.data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                </span>
            </div>
        </motion.div>
    );
};


// Empty state component
const EmptyState: React.FC = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
        <div className="p-4 bg-[#1E1E20] rounded-2xl border border-white/5 mb-4">
            <Activity size={32} className="text-zinc-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
        <p className="text-sm text-zinc-500 max-w-xs">
            Log actions to see your trends and momentum over time.
        </p>
    </motion.div>
);

export const PerformanceView: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('30d');

    const {
        actionsPerDay,
        responsesPerDay,
        leadsPerDay,
        revenueOverTime,
        pipelineSizeOverTime,
        isLoading,
        totalActions,
    } = usePerformanceData(timeRange);

    const hasData = totalActions > 0;

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight">Trends & Momentum</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        Historical patterns from logged activity
                    </p>
                </div>

                {/* Time range selector */}
                <LayoutGroup>
                    <div className="flex items-center gap-1 p-1 bg-[#1E1E20] rounded-2xl border border-white/5">
                        {TIME_RANGES.map((range) => (
                            <motion.button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className="relative px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={springConfig}
                            >
                                {/* Animated background indicator */}
                                {timeRange === range.value && (
                                    <motion.div
                                        layoutId="timeRangeIndicator"
                                        className="absolute inset-0 bg-[#9D7AFF] rounded-xl"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 35,
                                        }}
                                    />
                                )}
                                <span className={`relative z-10 ${timeRange === range.value ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>
                                    {range.label}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </LayoutGroup>
            </header>

            {/* Loading state */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-2 border-[#8561EF] border-t-transparent rounded-full"
                    />
                </div>
            ) : !hasData ? (
                <EmptyState />
            ) : (
                /* Graphs grid */
                <motion.div
                    key={timeRange} // Re-animate on time range change
                    className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <TrendGraph
                        series={actionsPerDay}
                        color={GRAPH_COLORS.actions}
                        icon={METRIC_ICONS.actions}
                    />
                    <TrendGraph
                        series={responsesPerDay}
                        color={GRAPH_COLORS.responses}
                        icon={METRIC_ICONS.responses}
                    />
                    <TrendGraph
                        series={leadsPerDay}
                        color={GRAPH_COLORS.leads}
                        icon={METRIC_ICONS.leads}
                    />
                    <TrendGraph
                        series={revenueOverTime}
                        color={GRAPH_COLORS.revenue}
                        icon={METRIC_ICONS.revenue}
                        formatValue={(v) => v > 0 ? `$${v.toLocaleString()}` : '—'}
                    />
                    <TrendGraph
                        series={pipelineSizeOverTime}
                        color={GRAPH_COLORS.pipeline}
                        icon={METRIC_ICONS.pipeline}
                    />
                </motion.div>
            )}
        </div>
    );
};
