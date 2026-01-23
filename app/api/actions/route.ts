import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { LoggedAction } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data', 'logged-actions.json');

// Ensure data directory exists
function ensureDataDir() {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
    }
}

// Read all actions from file
function readActions(): LoggedAction[] {
    ensureDataDir();
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Write actions to file
function writeActions(actions: LoggedAction[]) {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(actions, null, 2), 'utf-8');
}

// GET - Fetch all actions (with optional date filter)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('date'); // Format: YYYY-MM-DD

    const actions = readActions();

    if (dateFilter) {
        const filtered = actions.filter(action => {
            const actionDate = new Date(action.createdAt).toISOString().split('T')[0];
            return actionDate === dateFilter;
        });
        return NextResponse.json(filtered);
    }

    return NextResponse.json(actions);
}

// POST - Create a new action
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const actions = readActions();

        const outcome = body.outcome || null;

        // Derive status and flags from outcome
        const hasResponse = outcome && ['response', 'qualified', 'next-step', 'closed-won', 'closed-lost'].includes(outcome);
        const isLead = outcome && ['qualified', 'closed-won'].includes(outcome);
        const isClosed = outcome && ['closed-won', 'closed-lost'].includes(outcome);

        const newAction: LoggedAction = {
            id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            actionType: body.actionType,
            channel: body.channel || null,
            surface: body.surface || 'public',
            note: body.note || '',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: isClosed ? 'completed' : (body.actionType === 'followup' ? 'needs-followup' : 'logged'),
            outcome: outcome,
            hasResponse: hasResponse,
            isLead: isLead,
            revenue: 0,
        };

        actions.unshift(newAction); // Add to beginning for recent-first order
        writeActions(actions);

        return NextResponse.json(newAction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
    }
}

// PATCH - Update an action
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Action ID required' }, { status: 400 });
        }

        const actions = readActions();
        const index = actions.findIndex(a => a.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
        }

        actions[index] = { ...actions[index], ...updates };
        writeActions(actions);

        return NextResponse.json(actions[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
    }
}
