import { MetricData, PerformanceChannel, ArchiveItem } from '@/types';

export const COLORS = {
    bg: '#131313',
    surface: '#1E1E20',
    accent: '#8561EF', // Purple
    softAccent: '#E4DBFF', // Lavender
    highlight: '#E3FF93', // Lime Green
    border: 'rgba(255, 255, 255, 0.05)',
    textSecondary: '#A1A1AA',
};

// Today view metrics - values are computed from logged actions
export const TODAY_METRIC_KEYS = ['actionsLogged', 'responsesLogged', 'activeItems', 'leadsCreated', 'revenue'] as const;

export const TODAY_METRIC_LABELS: Record<typeof TODAY_METRIC_KEYS[number], string> = {
    actionsLogged: 'Actions Logged',
    responsesLogged: 'Responses',
    activeItems: 'Active Items',
    leadsCreated: 'Leads Created',
    revenue: 'Revenue',
};

// Format metric values for display
export function formatMetricValue(key: typeof TODAY_METRIC_KEYS[number], value: number): string {
    if (key === 'revenue') {
        return value > 0 ? `$${value.toLocaleString()}` : '—';
    }
    return value.toString();
}

// Pipeline metrics are now computed from logged actions in usePipelineData hook

export const CHANNELS_METRICS: MetricData[] = [
    { id: 'c1', label: 'Total Volume', value: '1.2M', change: '+8%', isPrimary: true },
    { id: 'c2', label: 'Cost Per Op', value: '$0.42', change: '-4%' },
    { id: 'c3', label: 'Effort Ratio', value: '1:4', change: 'Optimal' },
    { id: 'c4', label: 'Top Channel', value: 'LinkedIn', change: 'Stable' },
];

// MATRICES_METRICS removed - now computed from logged actions in useMatricesData hook

export const ARCHIVE_METRICS: MetricData[] = [
    { id: 'a1', label: 'Historical Record', value: '14,842', change: '+42d', isPrimary: true },
    { id: 'a2', label: 'Success Termination', value: '22%', change: '+1.4%' },
    { id: 'a3', label: 'Avg Cycle Length', value: '48 days', change: 'Stable' },
    { id: 'a4', label: 'Data Retention', value: '100%', change: 'Nominal' },
];

// Action type display mapping
export const ACTION_TYPE_DISPLAY: Record<'dm' | 'post' | 'comment' | 'followup', { type: 'outbound' | 'reply' | 'system', label: string }> = {
    dm: { type: 'outbound', label: 'Direct Message' },
    post: { type: 'outbound', label: 'Post' },
    comment: { type: 'reply', label: 'Comment' },
    followup: { type: 'system', label: 'Follow-up' },
};

export const CHANNEL_DISPLAY: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'X (Twitter)',
    email: 'Email',
    reddit: 'Reddit',
};

// Follow-ups are now derived from logged actions with status 'needs-followup'

// Pipeline data is now derived from logged actions in usePipelineData hook

export const CHANNELS_DATA: PerformanceChannel[] = [
    {
        id: 'ch-1',
        name: 'LinkedIn',
        type: 'Private',
        score: 92,
        volume: '14.2k',
        path: 'M 0 160 Q 150 140 300 100 Q 450 60 600 80 Q 750 100 900 40'
    },
    {
        id: 'ch-2',
        name: 'X (Twitter)',
        type: 'Public',
        score: 78,
        volume: '84.1k',
        path: 'M 0 120 Q 150 130 300 150 Q 450 170 600 130 Q 750 90 900 110'
    },
    {
        id: 'ch-3',
        name: 'Reddit',
        type: 'Public',
        score: 64,
        volume: '22.5k',
        path: 'M 0 180 Q 150 190 300 170 Q 450 150 600 180 Q 750 195 900 170'
    },
    {
        id: 'ch-4',
        name: 'Direct Email',
        type: 'Private',
        score: 85,
        volume: '4.8k',
        path: 'M 0 100 Q 150 110 300 80 Q 450 50 600 40 Q 750 30 900 10'
    },
];

// MATRIX_ROI_DATA and MATRIX_DENSITY_DATA removed - now computed from logged actions in useMatricesData hook

export const ARCHIVE_DATA: ArchiveItem[] = [
    { id: 'ar-1', name: 'Zodiac Systems', channel: 'LinkedIn', date: 'Oct 24, 2024', outcome: 'Won', duration: '42d', summary: 'Enterprise license for 400 seats. Handed over to AM.' },
    { id: 'ar-2', name: 'Project Icarus', channel: 'Email', date: 'Oct 12, 2024', outcome: 'Dead', duration: '14d', summary: 'No budget for FY24. Prospect unresponsive after 3rd touch.' },
    { id: 'ar-3', name: 'Vanguard Group', channel: 'X (Twitter)', date: 'Oct 05, 2024', outcome: 'Stalled', duration: '89d', summary: 'Decision maker left company. Pipeline entry cleared.' },
    { id: 'ar-4', name: 'Echo Tech', channel: 'Direct Email', date: 'Sep 28, 2024', outcome: 'Completed', duration: '5d', summary: 'One-time consultation service delivered and closed.' },
    { id: 'ar-5', name: 'Nebula Labs', channel: 'LinkedIn', date: 'Sep 15, 2024', outcome: 'Won', duration: '12d', summary: 'Seed round partner agreement finalized.' },
    { id: 'ar-6', name: 'Solstice Retail', channel: 'Reddit', date: 'Sep 02, 2024', outcome: 'Dead', duration: '3d', summary: 'Low intent. Target disqualified after initial research.' },
    { id: 'ar-7', name: 'Kinesis Co', channel: 'Email', date: 'Aug 24, 2024', outcome: 'Won', duration: '55d', summary: 'Long cycle expansion deal. Closed at $85k ACV.' },
    { id: 'ar-8', name: 'Aether Finance', channel: 'LinkedIn', date: 'Aug 10, 2024', outcome: 'Completed', duration: '20d', summary: 'Audit complete. Project archived as per retention policy.' },
];

// Animation configs for framer-motion
export const springConfig = { type: 'spring' as const, stiffness: 350, damping: 35 };
export const snappySpring = { type: 'spring' as const, stiffness: 500, damping: 35 };
