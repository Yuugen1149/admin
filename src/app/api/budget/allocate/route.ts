import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { forum_id, amount, user_role } = body;

        // Verify RBAC
        const allowedRoles = ['Treasurer', 'Subtreasurer', 'Chair', 'Vice Chair', 'Admin'];
        if (!allowedRoles.includes(user_role)) {
            return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
        }

        const updated = await db.budget.updateAllocation(forum_id, amount);
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error allocating budget:', error);
        return NextResponse.json({ error: 'Failed to allocate budget' }, { status: 500 });
    }
}
