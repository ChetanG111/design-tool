import { MetricData, ActivityItem, FollowUpItem, PipelineStage, PerformanceChannel, MatrixRow, ArchiveItem } from '@/types';

export const COLORS = {
    bg: '#131313',
    surface: '#1E1E20',
    accent: '#8561EF', // Purple
    softAccent: '#E4DBFF', // Lavender
    highlight: '#E3FF93', // Lime Green
    border: 'rgba(255, 255, 255, 0.05)',
    textSecondary: '#A1A1AA',
};

export const MOCK_METRICS: MetricData[] = [
    { id: '1', label: 'Active Sequences', value: '42', change: '+12%', isPrimary: true },
    { id: '2', label: 'Engagement Rate', value: '18.4%', change: '+2.1%' },
    { id: '3', label: 'Pending Replies', value: '256', change: '+5.4%' },
    { id: '4', label: 'Deliverability', value: '99.2%', change: '+0.1%' },
    { id: '5', label: 'Qualified Meetings', value: '12', change: '+4%' },
];

export const PIPELINE_METRICS: MetricData[] = [
    { id: 'p1', label: 'Pipeline Value', value: '$842k', change: '+14%', isPrimary: true },
    { id: 'p2', label: 'Avg Deal Size', value: '$24.5k', change: '+2.1%' },
    { id: 'p3', label: 'Sales Velocity', value: '18 days', change: '-2d' },
    { id: 'p4', label: 'Conversion', value: '4.2%', change: '+0.4%' },
];

export const CHANNELS_METRICS: MetricData[] = [
    { id: 'c1', label: 'Total Volume', value: '1.2M', change: '+8%', isPrimary: true },
    { id: 'c2', label: 'Cost Per Op', value: '$0.42', change: '-4%' },
    { id: 'c3', label: 'Effort Ratio', value: '1:4', change: 'Optimal' },
    { id: 'c4', label: 'Top Channel', value: 'LinkedIn', change: 'Stable' },
];

export const MATRICES_METRICS: MetricData[] = [
    { id: 'm1', label: 'Avg ROI', value: '8.4x', change: '+1.2x', isPrimary: true },
    { id: 'm2', label: 'Resource Load', value: '72%', change: '+4%' },
    { id: 'm3', label: 'Efficiency Index', value: '0.94', change: 'Stable' },
    { id: 'm4', label: 'Waste Factor', value: '12%', change: '-2%' },
];

export const ARCHIVE_METRICS: MetricData[] = [
    { id: 'a1', label: 'Historical Record', value: '14,842', change: '+42d', isPrimary: true },
    { id: 'a2', label: 'Success Termination', value: '22%', change: '+1.4%' },
    { id: 'a3', label: 'Avg Cycle Length', value: '48 days', change: 'Stable' },
    { id: 'a4', label: 'Data Retention', value: '100%', change: 'Nominal' },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 'act-1', type: 'outbound', target: 'Acme Corp', timestamp: '2m ago', status: 'active', detail: 'Step 4 / Follow-up sequence initiated' },
    { id: 'act-2', type: 'reply', target: 'John D. (Global X)', timestamp: '14m ago', status: 'completed', detail: 'Meeting link requested via LinkedIn' },
    { id: 'act-3', type: 'system', target: 'Infrastructure', timestamp: '1h ago', status: 'completed', detail: 'DNS warmup cycle completed for node-7' },
    { id: 'act-4', type: 'outbound', target: 'Stellar Labs', timestamp: '2h ago', status: 'pending', detail: 'Batched upload scheduled for 5:00 PM' },
    { id: 'act-5', type: 'reply', target: 'Sarah M. (Fintech)', timestamp: '3h ago', status: 'active', detail: 'Analyzing sentiment: positive interest' },
    { id: 'act-6', type: 'outbound', target: 'Hyperion', timestamp: '4h ago', status: 'completed', detail: 'Initial touchpoint delivered' },
];

export const MOCK_FOLLOW_UPS: FollowUpItem[] = [
    { id: 'fu-1', title: 'Review response for Q3 partner deal', due: '14:00', priority: 'high' },
    { id: 'fu-2', title: 'A/B Test results review: Subject lines', due: '16:30', priority: 'medium' },
    { id: 'fu-3', title: 'Node maintenance check: shard-B', due: '18:00', priority: 'low' },
    { id: 'fu-4', title: 'Sync CRM data for enterprise leads', due: 'Tomorrow', priority: 'medium' },
];

export const PIPELINE_DATA: PipelineStage[] = [
    {
        id: 'engaged',
        label: 'Engaged',
        cards: [
            { id: 'c1', title: 'Global Dynamics', subtitle: 'Enterprise License', value: '$24k', days: 2, health: 'good' },
            { id: 'c2', title: 'Vertex Solutions', subtitle: 'Expansion Suite', value: '$12k', days: 5, health: 'neutral' },
            { id: 'c3', title: 'Nova AI', subtitle: 'Platform Access', value: '$45k', days: 1, health: 'good' },
        ]
    },
    {
        id: 'qualified',
        label: 'Qualified',
        cards: [
            { id: 'c4', title: 'Stellar Labs', subtitle: 'Custom Integration', value: '$68k', days: 12, health: 'neutral' },
            { id: 'c5', title: 'Aura Fintech', subtitle: 'Core API', value: '$32k', days: 8, health: 'good' },
        ]
    },
    {
        id: 'discussion',
        label: 'Closing',
        cards: [
            { id: 'c6', title: 'Pulse Media', subtitle: 'Managed Services', value: '$110k', days: 24, health: 'good' },
            { id: 'c7', title: 'Blue Ocean', subtitle: 'Seat Expansion', value: '$8k', days: 4, health: 'good' },
        ]
    },
    {
        id: 'stalled',
        label: 'Stalled',
        cards: [
            { id: 'c10', title: 'Legacy Partners', subtitle: 'Cloud Migration', value: '$15k', days: 89, health: 'at-risk' },
        ]
    }
];

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

export const MATRIX_ROI_DATA: MatrixRow[] = [
    { id: 'mx-1', item: 'Executive Reach-out', variableA: '14.2%', variableB: '2.4', variableC: '0.82', roi: '12.4x', effort: 'Med' },
    { id: 'mx-2', item: 'Cold Multi-touch', variableA: '8.1%', variableB: '4.1', variableC: '0.34', roi: '4.2x', effort: 'High' },
    { id: 'mx-3', item: 'Community Inbound', variableA: '22.5%', variableB: '1.2', variableC: '0.94', roi: '18.1x', effort: 'Low' },
    { id: 'mx-4', item: 'Event Sync (Local)', variableA: '31.2%', variableB: '0.8', variableC: '0.71', roi: '8.5x', effort: 'Med' },
    { id: 'mx-5', item: 'Partner Referrals', variableA: '44.0%', variableB: '0.4', variableC: '0.98', roi: '22.4x', effort: 'Low' },
];

export const MATRIX_DENSITY_DATA: MatrixRow[] = [
    { id: 'md-1', item: 'Tier 1 Accounts', variableA: '4.2k', variableB: '$120k', variableC: '0.14', roi: '14.2x', effort: 'High' },
    { id: 'md-2', item: 'Tier 2 Accounts', variableA: '12.8k', variableB: '$45k', variableC: '0.28', roi: '9.8x', effort: 'Med' },
    { id: 'md-3', item: 'SME Market', variableA: '45.1k', variableB: '$8k', variableC: '0.42', roi: '3.1x', effort: 'Low' },
];

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
