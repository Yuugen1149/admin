import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const permissions = await db.permissions.findAll();
    return NextResponse.json(permissions);
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value?.toLowerCase() || '';

        // Only Chair and Admin can change permissions
        if (!['chair', 'admin'].includes(userRole)) {
            return NextResponse.json(
                { error: 'Unauthorized. Only Chair and Admin can change permissions.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { action_key, allowed_roles } = body;

        if (!action_key || !Array.isArray(allowed_roles)) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const updated = await db.permissions.update(action_key, allowed_roles);
        return NextResponse.json(updated);
    } catch (e) {
        console.error('Update permission error:', e);
        return NextResponse.json({ error: 'Failed to update permission' }, { status: 500 });
    }
}
