import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const metrics = await db.metrics.get();
        // Return default values if no record exists yet
        if (!metrics) {
            return NextResponse.json({
                total_members: '17',
                upcoming_events: '3',
                active_projects: '5'
            });
        }
        return NextResponse.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value;

        // RBAC: Only Chair, Vice Chair, Secretary, Admin
        const allowedRoles = ['chair', 'vice chair', 'secretary', 'admin'];
        if (!userRole || !allowedRoles.includes(userRole.toLowerCase())) {
            console.warn(`User role '${userRole}' denied edit access.`);
            return NextResponse.json(
                { error: 'Unauthorized: Only Chair, Vice Chair, Secretary, or Admin can edit metrics' },
                { status: 403 }
            );
        }

        const body = await request.json();
        console.log("Processing update for:", body);

        const updated = await db.metrics.update(body);
        console.log("Update success:", updated);

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('Error updating metrics:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update metrics' },
            { status: 500 }
        );
    }
}
