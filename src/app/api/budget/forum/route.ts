import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, user_role } = body;

        // Verify RBAC
        const allowedRoles = ['Treasurer', 'Subtreasurer', 'Chair', 'Vice Chair', 'Admin'];
        if (!allowedRoles.includes(user_role)) {
            return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
        }

        const newForum = await db.budget.createForum(name);
        return NextResponse.json(newForum);
    } catch (error) {
        console.error('Error creating forum:', error);
        return NextResponse.json({ error: 'Failed to create forum' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, user_role } = body;

        const allowedRoles = ['Treasurer', 'Subtreasurer', 'Chair', 'Vice Chair', 'Admin'];
        if (!allowedRoles.includes(user_role)) {
            return NextResponse.json({ error: 'Unauthorized: Insufficient permissions' }, { status: 403 });
        }

        const updatedForum = await db.budget.updateForumName(id, name);
        return NextResponse.json(updatedForum);
    } catch (error) {
        console.error('Error updating forum name:', error);
        return NextResponse.json({ error: 'Failed to update forum name' }, { status: 500 });
    }
}
