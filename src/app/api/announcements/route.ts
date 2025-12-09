import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    const announcements = await db.announcements.findAll();
    return NextResponse.json(announcements);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, priority } = body;

        // Get author from cookies
        const cookieStore = await cookies();
        const author = cookieStore.get('user_name')?.value || 'Admin';

        const newAnnouncement = await db.announcements.create({
            title,
            content,
            author,
            priority: priority || 'normal'
        });

        return NextResponse.json(newAnnouncement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }
}
