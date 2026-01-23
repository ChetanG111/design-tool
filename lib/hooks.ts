'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoggedAction } from '@/types';

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

// Format relative timestamp
export function formatRelativeTime(isoString: string): string {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
}

// Hook to fetch and manage today's logged actions
export function useTodayActions() {
    const [actions, setActions] = useState<LoggedAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActions = useCallback(async () => {
        try {
            const today = getTodayDate();
            const response = await fetch(`/api/actions?date=${today}`);
            if (!response.ok) throw new Error('Failed to fetch actions');
            const data = await response.json();
            setActions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActions();
        // Poll every 5 seconds for updates (local app, so this is fine)
        const interval = setInterval(fetchActions, 5000);
        return () => clearInterval(interval);
    }, [fetchActions]);

    const logAction = useCallback(async (action: {
        actionType: LoggedAction['actionType'];
        channel: LoggedAction['channel'];
        surface: LoggedAction['surface'];
        note: string;
    }) => {
        try {
            const response = await fetch('/api/actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(action),
            });
            if (!response.ok) throw new Error('Failed to log action');
            const newAction = await response.json();
            setActions(prev => [newAction, ...prev]);
            return newAction;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, []);

    const updateAction = useCallback(async (id: string, updates: Partial<LoggedAction>) => {
        try {
            const response = await fetch('/api/actions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });
            if (!response.ok) throw new Error('Failed to update action');
            const updated = await response.json();
            setActions(prev => prev.map(a => a.id === id ? updated : a));
            return updated;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            throw err;
        }
    }, []);

    // Computed metrics
    const metrics = {
        actionsLogged: actions.length,
        responsesLogged: actions.filter(a => a.hasResponse).length,
        activeItems: actions.filter(a => a.status === 'needs-followup').length,
        leadsCreated: actions.filter(a => a.isLead).length,
        revenue: actions.reduce((sum, a) => sum + (a.revenue || 0), 0) / 100, // Convert cents to dollars
    };

    // Items needing follow-up (for Next Actions panel)
    const pendingFollowUps = actions.filter(a =>
        a.status === 'needs-followup' ||
        (a.status === 'logged' && a.actionType === 'followup')
    );

    return {
        actions,
        isLoading,
        error,
        metrics,
        pendingFollowUps,
        logAction,
        updateAction,
        refetch: fetchActions,
    };
}

// Pipeline item derived from logged actions
export interface PipelineItem {
    id: string;
    target: string; // Derived from channel + action type
    lastAction: string; // Description of last action
    lastActivityTime: string; // ISO string
    daysSinceActivity: number;
    channel: string | null;
    outcome: string | null;
    status: 'engaged' | 'qualified' | 'closing' | 'stalled';
}

export interface PipelineStageData {
    id: string;
    label: string;
    items: PipelineItem[];
}

// Stalled threshold in days
const STALLED_THRESHOLD_DAYS = 7;

// Calculate days since a date
function daysSince(isoString: string): number {
    const now = new Date();
    const date = new Date(isoString);
    const diffMs = now.getTime() - date.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// Hook to fetch and derive pipeline data from ALL logged actions
export function usePipelineData() {
    const [allActions, setAllActions] = useState<LoggedAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllActions = useCallback(async () => {
        try {
            // Fetch all actions (no date filter)
            const response = await fetch('/api/actions');
            if (!response.ok) throw new Error('Failed to fetch actions');
            const data = await response.json();
            setAllActions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllActions();
        const interval = setInterval(fetchAllActions, 5000);
        return () => clearInterval(interval);
    }, [fetchAllActions]);

    // Derive pipeline items from actions
    // Only include actions that have some form of engagement (response, qualified, next-step)
    const derivePipelineItems = useCallback((): PipelineStageData[] => {
        const engaged: PipelineItem[] = [];
        const qualified: PipelineItem[] = [];
        const closing: PipelineItem[] = [];
        const stalled: PipelineItem[] = [];

        // Filter to only actions that belong in pipeline
        // (has response OR is qualified OR has next-step)
        const pipelineActions = allActions.filter(a =>
            a.hasResponse ||
            a.outcome === 'qualified' ||
            a.outcome === 'next-step' ||
            a.outcome === 'response'
        );

        // Exclude completed/closed actions
        const activeActions = pipelineActions.filter(a =>
            a.status !== 'completed' &&
            a.outcome !== 'closed-won' &&
            a.outcome !== 'closed-lost'
        );

        for (const action of activeActions) {
            const days = daysSince(action.createdAt);
            const channelDisplay = action.channel ?
                { linkedin: 'LinkedIn', twitter: 'X', email: 'Email', reddit: 'Reddit' }[action.channel] :
                'Unknown';
            const actionDisplay = {
                dm: 'DM',
                post: 'Post',
                comment: 'Comment',
                followup: 'Follow-up'
            }[action.actionType];

            const item: PipelineItem = {
                id: action.id,
                target: `${channelDisplay} ${actionDisplay}`,
                lastAction: action.note || `${actionDisplay} logged`,
                lastActivityTime: action.createdAt,
                daysSinceActivity: days,
                channel: action.channel,
                outcome: action.outcome || null,
                status: 'engaged', // Will be updated below
            };

            // Determine which column based on outcome and activity
            if (days >= STALLED_THRESHOLD_DAYS) {
                item.status = 'stalled';
                stalled.push(item);
            } else if (action.outcome === 'next-step') {
                item.status = 'closing';
                closing.push(item);
            } else if (action.outcome === 'qualified' || action.isLead) {
                item.status = 'qualified';
                qualified.push(item);
            } else if (action.hasResponse || action.outcome === 'response') {
                item.status = 'engaged';
                engaged.push(item);
            }
        }

        return [
            { id: 'engaged', label: 'Engaged', items: engaged },
            { id: 'qualified', label: 'Qualified', items: qualified },
            { id: 'closing', label: 'Closing', items: closing },
            { id: 'stalled', label: 'Stalled', items: stalled },
        ];
    }, [allActions]);

    const pipelineData = derivePipelineItems();

    // Compute metrics from pipeline
    const metrics = {
        totalActive: pipelineData.reduce((sum, stage) => sum + stage.items.length, 0),
        engaged: pipelineData.find(s => s.id === 'engaged')?.items.length || 0,
        qualified: pipelineData.find(s => s.id === 'qualified')?.items.length || 0,
        closing: pipelineData.find(s => s.id === 'closing')?.items.length || 0,
    };

    return {
        pipelineData,
        metrics,
        isLoading,
        error,
        refetch: fetchAllActions,
    };
}

// Performance time-series data types (imported from types but redefined for hook)
export interface PerformanceDataPoint {
    date: string; // YYYY-MM-DD
    value: number;
}

export interface TimeSeriesData {
    id: string;
    label: string;
    data: PerformanceDataPoint[];
    total: number;
}

export type TimeRange = '7d' | '14d' | '30d' | 'all';

// Get date N days ago in YYYY-MM-DD format
function getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// Get date string from ISO timestamp
function getDateFromISO(isoString: string): string {
    return isoString.split('T')[0];
}

// Generate array of dates between start and end
function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

// Hook to fetch and compute performance trends from logged actions
export function usePerformanceData(timeRange: TimeRange = '30d') {
    const [allActions, setAllActions] = useState<LoggedAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllActions = useCallback(async () => {
        try {
            const response = await fetch('/api/actions');
            if (!response.ok) throw new Error('Failed to fetch actions');
            const data = await response.json();
            setAllActions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllActions();
        const interval = setInterval(fetchAllActions, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [fetchAllActions]);

    // Compute time-series data from actions
    const computeTimeSeries = useCallback((): {
        actionsPerDay: TimeSeriesData;
        responsesPerDay: TimeSeriesData;
        leadsPerDay: TimeSeriesData;
        revenueOverTime: TimeSeriesData;
        pipelineSizeOverTime: TimeSeriesData;
    } => {
        const today = new Date().toISOString().split('T')[0];

        // Determine date range based on timeRange
        let startDate: string;
        if (timeRange === 'all' && allActions.length > 0) {
            // Find oldest action
            const oldest = allActions.reduce((min, a) =>
                a.createdAt < min ? a.createdAt : min, allActions[0]?.createdAt || today
            );
            startDate = getDateFromISO(oldest);
        } else {
            const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
            startDate = getDateDaysAgo(days);
        }

        const dateRange = generateDateRange(startDate, today);

        // Initialize counters for each date
        const actionsMap: Record<string, number> = {};
        const responsesMap: Record<string, number> = {};
        const leadsMap: Record<string, number> = {};
        const revenueMap: Record<string, number> = {};
        const pipelineMap: Record<string, number> = {};

        dateRange.forEach(date => {
            actionsMap[date] = 0;
            responsesMap[date] = 0;
            leadsMap[date] = 0;
            revenueMap[date] = 0;
            pipelineMap[date] = 0;
        });

        // Count actions per day
        allActions.forEach(action => {
            const actionDate = getDateFromISO(action.createdAt);
            if (actionsMap[actionDate] !== undefined) {
                actionsMap[actionDate]++;

                if (action.hasResponse) {
                    responsesMap[actionDate]++;
                }

                if (action.isLead) {
                    leadsMap[actionDate]++;
                }

                if (action.revenue) {
                    revenueMap[actionDate] += action.revenue / 100; // Convert cents to dollars
                }

                // Pipeline: count items that are active (not closed)
                if (
                    action.status !== 'completed' &&
                    action.outcome !== 'closed-won' &&
                    action.outcome !== 'closed-lost' &&
                    (action.hasResponse || action.outcome === 'qualified' || action.outcome === 'next-step')
                ) {
                    pipelineMap[actionDate]++;
                }
            }
        });

        // Convert maps to arrays
        const toDataArray = (map: Record<string, number>): PerformanceDataPoint[] =>
            dateRange.map(date => ({ date, value: map[date] || 0 }));

        const sumValues = (map: Record<string, number>): number =>
            Object.values(map).reduce((sum, v) => sum + v, 0);

        return {
            actionsPerDay: {
                id: 'actions',
                label: 'Actions Logged',
                data: toDataArray(actionsMap),
                total: sumValues(actionsMap),
            },
            responsesPerDay: {
                id: 'responses',
                label: 'Responses Received',
                data: toDataArray(responsesMap),
                total: sumValues(responsesMap),
            },
            leadsPerDay: {
                id: 'leads',
                label: 'Leads Created',
                data: toDataArray(leadsMap),
                total: sumValues(leadsMap),
            },
            revenueOverTime: {
                id: 'revenue',
                label: 'Revenue',
                data: toDataArray(revenueMap),
                total: sumValues(revenueMap),
            },
            pipelineSizeOverTime: {
                id: 'pipeline',
                label: 'Pipeline Activity',
                data: toDataArray(pipelineMap),
                total: sumValues(pipelineMap),
            },
        };
    }, [allActions, timeRange]);

    const timeSeries = computeTimeSeries();

    return {
        ...timeSeries,
        isLoading,
        error,
        refetch: fetchAllActions,
        totalActions: allActions.length,
    };
}

// ========================================
// MATRICES DATA HOOK
// Computes all matrices from logged actions only
// ========================================

import { TimeReturnRow, SenseMatrixRow, ValueDensityRow } from '@/types';

// Display mappings
const CHANNEL_LABELS: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'X (Twitter)',
    email: 'Email',
    reddit: 'Reddit',
};

const ACTION_TYPE_LABELS: Record<string, string> = {
    dm: 'DM',
    post: 'Post',
    comment: 'Comment',
    followup: 'Follow-up',
};

const OUTCOME_LABELS: Record<string, string> = {
    response: 'Response received',
    qualified: 'Qualified lead',
    'next-step': 'Next step agreed',
    'closed-won': 'Closed (Won)',
    'closed-lost': 'Closed (Lost)',
};

export function useMatricesData() {
    const [allActions, setAllActions] = useState<LoggedAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllActions = useCallback(async () => {
        try {
            const response = await fetch('/api/actions');
            if (!response.ok) throw new Error('Failed to fetch actions');
            const data = await response.json();
            setAllActions(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllActions();
        const interval = setInterval(fetchAllActions, 5000);
        return () => clearInterval(interval);
    }, [fetchAllActions]);

    // ========================================
    // TIME → RETURN MATRIX
    // Rows: action types grouped by channel
    // ========================================
    const computeTimeReturnMatrix = useCallback((): TimeReturnRow[] => {
        // Group by action type
        const byActionType = new Map<string, LoggedAction[]>();

        for (const action of allActions) {
            const key = action.actionType;
            if (!byActionType.has(key)) {
                byActionType.set(key, []);
            }
            byActionType.get(key)!.push(action);
        }

        const rows: TimeReturnRow[] = [];

        for (const [actionType, actions] of byActionType) {
            const outcomes = actions.filter(a => a.outcome && a.outcome !== 'closed-lost').length;
            const revenue = actions.reduce((sum, a) => sum + (a.revenue || 0), 0);
            // Time tracking not yet implemented - set to null
            const timeSpentMins = null;

            rows.push({
                id: `tr-${actionType}`,
                label: ACTION_TYPE_LABELS[actionType] || actionType,
                actionsLogged: actions.length,
                timeSpentMins,
                outcomes,
                revenue,
                returnPerHour: null, // No time data yet
            });
        }

        // Also group by channel
        const byChannel = new Map<string, LoggedAction[]>();
        for (const action of allActions) {
            const key = action.channel || 'unknown';
            if (!byChannel.has(key)) {
                byChannel.set(key, []);
            }
            byChannel.get(key)!.push(action);
        }

        for (const [channel, actions] of byChannel) {
            const outcomes = actions.filter(a => a.outcome && a.outcome !== 'closed-lost').length;
            const revenue = actions.reduce((sum, a) => sum + (a.revenue || 0), 0);

            rows.push({
                id: `tr-ch-${channel}`,
                label: CHANNEL_LABELS[channel] || channel,
                actionsLogged: actions.length,
                timeSpentMins: null,
                outcomes,
                revenue,
                returnPerHour: null,
            });
        }

        return rows;
    }, [allActions]);

    // ========================================
    // SENSE MATRIX (Quality Check)
    // Rows: individual actions with clarity tags
    // ========================================
    const computeSenseMatrix = useCallback((): SenseMatrixRow[] => {
        return allActions.slice(0, 20).map((action) => {
            // ICP/Problem clarity would come from logged tags
            // For now, derive from what we have:
            // - If outcome exists, assume some clarity
            // - Otherwise unknown
            const hasOutcome = !!action.outcome;
            const hasNote = action.note && action.note.length > 10;

            const icpClarity: 'clear' | 'unclear' | 'unknown' =
                hasOutcome ? 'clear' : (hasNote ? 'unclear' : 'unknown');

            const problemClarity: 'clear' | 'unclear' | 'unknown' =
                hasOutcome ? 'clear' : 'unknown';

            const channelLabel = action.channel ? CHANNEL_LABELS[action.channel] : 'Unknown';
            const actionLabel = ACTION_TYPE_LABELS[action.actionType] || action.actionType;

            return {
                id: `sense-${action.id}`,
                actionId: action.id,
                label: action.note || `${channelLabel} ${actionLabel}`,
                icpClarity,
                problemClarity,
                outcome: action.outcome ? OUTCOME_LABELS[action.outcome] : '—',
                timestamp: action.createdAt,
            };
        });
    }, [allActions]);

    // ========================================
    // VALUE DENSITY MATRIX
    // Rows: Channel, Surface, Action type dimensions
    // ========================================
    const computeValueDensityMatrix = useCallback((): ValueDensityRow[] => {
        const rows: ValueDensityRow[] = [];

        // By Channel
        const byChannel = new Map<string, LoggedAction[]>();
        for (const action of allActions) {
            const key = action.channel || 'unknown';
            if (!byChannel.has(key)) {
                byChannel.set(key, []);
            }
            byChannel.get(key)!.push(action);
        }

        for (const [channel, actions] of byChannel) {
            rows.push({
                id: `vd-ch-${channel}`,
                dimension: CHANNEL_LABELS[channel] || channel,
                dimensionType: 'channel',
                actions: actions.length,
                leads: actions.filter(a => a.isLead).length,
                revenue: actions.reduce((sum, a) => sum + (a.revenue || 0), 0),
            });
        }

        // By Surface
        const bySurface = new Map<string, LoggedAction[]>();
        for (const action of allActions) {
            const key = action.surface;
            if (!bySurface.has(key)) {
                bySurface.set(key, []);
            }
            bySurface.get(key)!.push(action);
        }

        for (const [surface, actions] of bySurface) {
            rows.push({
                id: `vd-sf-${surface}`,
                dimension: surface === 'public' ? 'Public' : 'Private',
                dimensionType: 'surface',
                actions: actions.length,
                leads: actions.filter(a => a.isLead).length,
                revenue: actions.reduce((sum, a) => sum + (a.revenue || 0), 0),
            });
        }

        // By Action Type
        const byActionType = new Map<string, LoggedAction[]>();
        for (const action of allActions) {
            const key = action.actionType;
            if (!byActionType.has(key)) {
                byActionType.set(key, []);
            }
            byActionType.get(key)!.push(action);
        }

        for (const [actionType, actions] of byActionType) {
            rows.push({
                id: `vd-at-${actionType}`,
                dimension: ACTION_TYPE_LABELS[actionType] || actionType,
                dimensionType: 'actionType',
                actions: actions.length,
                leads: actions.filter(a => a.isLead).length,
                revenue: actions.reduce((sum, a) => sum + (a.revenue || 0), 0),
            });
        }

        return rows;
    }, [allActions]);

    // Compute stats (raw counts only - no percentages unless directly computed)
    const stats = {
        totalActions: allActions.length,
        totalOutcomes: allActions.filter(a => a.outcome).length,
        totalLeads: allActions.filter(a => a.isLead).length,
        totalRevenue: allActions.reduce((sum, a) => sum + (a.revenue || 0), 0),
    };

    return {
        timeReturnMatrix: computeTimeReturnMatrix(),
        senseMatrix: computeSenseMatrix(),
        valueDensityMatrix: computeValueDensityMatrix(),
        stats,
        isLoading,
        error,
        refetch: fetchAllActions,
    };
}
