import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await db.budget.getSettings();
        const allocations = await db.budget.getAllAllocations();

        return NextResponse.json({
            total_budget: settings?.total_amount || 0,
            last_updated: settings?.updated_at,
            allocations: allocations
        });
    } catch (error) {
        console.error('Error fetching budget:', error);
        return NextResponse.json({ error: 'Failed to fetch budget data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { total_amount, user_role, user_name } = body;

        // Verify RBAC
        const allowedRoles = ['Treasurer', 'Subtreasurer', 'Chair', 'Vice Chair', 'Admin'];
        if (!allowedRoles.includes(user_role)) {
            return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
        }

        const updated = await db.budget.updateTotal(total_amount, user_name);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating total budget:', error);
        return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
    }
}
