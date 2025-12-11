import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const folderId = parseInt(id);

        if (isNaN(folderId)) {
            return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
        }

        const folder = await db.folders.findById(folderId);
        if (!folder) {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        return NextResponse.json(folder);
    } catch (error) {
        console.error('Error fetching folder:', error);
        return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const folderId = parseInt(id);

        if (isNaN(folderId)) {
            return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
        }

        const body = await request.json();
        const { name, color } = body;

        const updatedFolder = await db.folders.update(folderId, { name, color });
        return NextResponse.json(updatedFolder);
    } catch (error) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const folderId = parseInt(id);

        if (isNaN(folderId)) {
            return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
        }

        // Delete folder (files will have folder_id set to NULL due to ON DELETE SET NULL)
        await db.folders.delete(folderId);
        return NextResponse.json({ success: true, message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}
