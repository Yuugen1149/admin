import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();
        const { folder_id } = body;

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
        }

        const updatedFile = await db.files.update(id, { folder_id });
        return NextResponse.json(updatedFile);
    } catch (error) {
        console.error('Error updating file:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const files = await db.files.findAll();
        const file = files.find(f => f.id === id);

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Delete from disk  
        const filePath = path.join(process.cwd(), 'public', file.file_path);
        try {
            await unlink(filePath);
        } catch (e) {
            console.error('Error deleting file from disk:', e);
            // Continue to delete from DB even if disk delete fails (ghost file)
        }

        // Delete from DB
        await db.files.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
