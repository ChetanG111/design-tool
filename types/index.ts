export interface MetricData {
    id: string;
    label: string;
    value: string;
    change?: string; // Optional - not used in logging-driven metrics
    isPrimary?: boolean;
}

// Logged action from the Log Action overlay
export interface LoggedAction {
    id: string;
    actionType: 'dm' | 'post' | 'comment' | 'followup';
    channel: 'linkedin' | 'twitter' | 'email' | 'reddit' | null;
    surface: 'public' | 'private';
    note: string;
    timestamp: string; // ISO string
    createdAt: string; // ISO string - when the action was logged

    // Status tracking
    status: 'logged' | 'needs-followup' | 'completed';

    // Outcome from the action
    outcome?: 'response' | 'qualified' | 'next-step' | 'closed-won' | 'closed-lost' | null;

    // Optional outcome tracking (derived from outcome)
    hasResponse?: boolean;
    isLead?: boolean;
    revenue?: number; // In cents to avoid floating point issues
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

// Generic matrix row type (deprecated - use specific types below)
export interface MatrixRow {
    id: string;
    item: string;
    variableA: string;
    variableB: string;
    variableC: string;
    roi: string;
    effort: 'Low' | 'Med' | 'High';
}

// Time → Return Matrix Row
// Answers: "What actions give me the best return for time spent?"
export interface TimeReturnRow {
    id: string;
    label: string; // Action type or channel
    actionsLogged: number;
    timeSpentMins: number | null; // null if not tracked
    outcomes: number; // count of outcomes produced
    revenue: number; // in cents
    returnPerHour: number | null; // revenue / hours, null if no time data
}

// Sense Matrix Row (Quality Check)
// Answers: "Was this action high-quality or noise?"
export interface SenseMatrixRow {
    id: string;
    actionId: string; // reference to the logged action
    label: string; // description of the action
    icpClarity: 'clear' | 'unclear' | 'unknown'; // ICP tag if logged
    problemClarity: 'clear' | 'unclear' | 'unknown'; // Problem clarity tag
    outcome: string; // descriptive outcome (not scored)
    timestamp: string;
}

// Value Density Matrix Row
// Answers: "Where is the value concentrated?"
export interface ValueDensityRow {
    id: string;
    dimension: string; // Channel, Surface, or Action type value
    dimensionType: 'channel' | 'surface' | 'actionType';
    actions: number;
    leads: number;
    revenue: number; // in cents
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

// Performance time-series data point
export interface PerformanceDataPoint {
    date: string; // YYYY-MM-DD
    value: number;
}

// Time series for a single metric
export interface TimeSeriesData {
    id: string;
    label: string;
    data: PerformanceDataPoint[];
    total: number; // Sum of all values in the series
}

// Available time ranges for performance view
export type TimeRange = '7d' | '14d' | '30d' | 'all';
