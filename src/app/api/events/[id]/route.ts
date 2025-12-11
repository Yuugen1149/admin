import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value?.toLowerCase().trim() || '';

        // Check Permissions
        let hasAccess = ['chair', 'admin'].includes(userRole);
        if (!hasAccess) {
            const permissions = await db.permissions.findAll();
            const perm = permissions.find((p: any) => p.action_key === 'delete_events');
            if (perm && perm.allowed_roles.includes(userRole)) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Unauthorized. Only authorized roles can delete events.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const eventId = parseInt(id);

        if (isNaN(eventId)) {
            return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
        }

        await db.events.delete(eventId);

        return NextResponse.json({ success: true, message: 'Event deleted successfully' });
    } catch (e) {
        console.error('Delete event error:', e);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
