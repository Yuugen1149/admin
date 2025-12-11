import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const folders = await db.folders.findAll();
        return NextResponse.json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userName = cookieStore.get("user_name")?.value || "Unknown";

        const body = await request.json();
        const { name, color, parent_id } = body;

        if (!name) {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
        }

        const folder = await db.folders.create({
            name,
            color: color || '#3B82F6',
            parent_id: parent_id || null,
            created_by: userName
        });

        return NextResponse.json(folder, { status: 201 });
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
