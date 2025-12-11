import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const events = await db.events.findAll();
    return NextResponse.json(events);
}

import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value?.toLowerCase().trim() || '';

        if (!userRole) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check Permissions
        let hasAccess = ['chair', 'admin'].includes(userRole);
        if (!hasAccess) {
            const permissions = await db.permissions.findAll();
            const perm = permissions.find((p: any) => p.action_key === 'create_event');
            if (perm && perm.allowed_roles.includes(userRole)) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { title, date, type, description } = body;

        const newEvent = await db.events.create({
            title,
            date,
            type,
            description
        });

        return NextResponse.json(newEvent);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
