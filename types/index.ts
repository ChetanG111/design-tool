export interface MetricData {
    id: string;
    label: string;
    value: string;
    change: string;
    isPrimary?: boolean;
}

export interface ActivityItem {
    id: string;
    type: 'outbound' | 'reply' | 'system';
    target: string;
    timestamp: string;
    status: 'active' | 'completed' | 'pending';
    detail: string;
}

export interface FollowUpItem {
    id: string;
    title: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
}

export interface PipelineCard {
    id: string;
    title: string;
    subtitle: string;
    value: string;
    days: number;
    health: 'good' | 'neutral' | 'at-risk';
}

export interface PipelineStage {
    id: string;
    label: string;
    cards: PipelineCard[];
}

export interface PerformanceChannel {
    id: string;
    name: string;
    type: 'Public' | 'Private';
    score: number;
    volume: string;
    path: string; // SVG path data for the graph
}

export interface MatrixRow {
    id: string;
    item: string;
    variableA: string;
    variableB: string;
    variableC: string;
    roi: string;
    effort: 'Low' | 'Med' | 'High';
}

export interface ArchiveItem {
    id: string;
    name: string;
    channel: string;
    date: string;
    outcome: 'Won' | 'Dead' | 'Completed' | 'Stalled';
    duration: string;
    summary: string;
}
