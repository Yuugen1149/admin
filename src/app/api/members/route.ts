import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const currentEmail = cookieStore.get("user_email")?.value;

    // Get all users (to check last_seen)
    const users = await db.users.findAll();
    const members = await db.members.findAll();

    // Threshold for "Active" is 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    const now = new Date().getTime();

    const enrichedMembers = members
        .filter((member: any) => member.email !== currentEmail) // Filter out self
        .map((member: any) => {
            const user = users.find((u: any) => u.email === member.email);
            let status = 'offline';

            if (user && user.last_seen) {
                const lastSeen = new Date(user.last_seen).getTime();
                if (now - lastSeen < FIVE_MINUTES) {
                    status = 'active';
                } else {
                    status = 'offline';
                }
            }

            // If user explicitly set "busy" or something else in members.json, we might want to respect it?
            // For now, let's override with calculated presence unless manually set to something specific?
            // The prompt asked for "active or offline when logged in".
            // So simpler: if active recently -> active, else offline.

            return { ...member, status };
        });

    return NextResponse.json(enrichedMembers);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, role, password } = body;

        // RBAC Check
        const cookieStore = await cookies();
        const userRole = cookieStore.get("user_role")?.value?.toLowerCase().trim() || "";

        // Check Permissions
        let hasAccess = ['chair', 'admin'].includes(userRole);
        if (!hasAccess) {
            const permissions = await db.permissions.findAll();
            const perm = permissions.find((p: any) => p.action_key === 'add_members');
            if (perm && perm.allowed_roles.includes(userRole)) {
                hasAccess = true;
            }
        }

        if (!hasAccess) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Validate
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create User
        // Note: Storing plain text password as per existing simple schema pattern.
        const userData = {
            name,
            email,
            password,
            role,
            created_at: new Date().toISOString()
        };

        await db.users.create(userData);

        // 2. Create Member
        const memberData = {
            name,
            email,
            phone,
            status: 'active',
            joined_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        };

        const newMember = await db.members.create(memberData);

        return NextResponse.json(newMember);

    } catch (error: any) {
        console.error('Error creating member:', error);
        return NextResponse.json({ error: error.message || 'Failed to create member' }, { status: 500 });
    }
}
