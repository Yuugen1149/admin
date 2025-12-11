"use client";

import { FileRecord } from "@/lib/db";
import { FileIcon, Download, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function FileItem({ file, onDelete }: { file: FileRecord; onDelete?: () => void }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [dragging, setDragging] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this file?")) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/files/${file.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
                if (onDelete) {
                    onDelete();
                }
            } else {
                alert("Failed to delete file");
            }
        } catch (e) {
            alert("Error deleting file");
        } finally {
            setDeleting(false);
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('fileId', file.id.toString());
        e.dataTransfer.effectAllowed = 'move';
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    return (
        <div
            className={`flex items-center gap-4 p-4 border-b border-border hover:bg-background transition-colors last:border-0 group cursor-move ${dragging ? 'opacity-50' : ''}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                <FileIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary truncate">{file.original_name}</div>
                <div className="text-xs text-text-secondary flex gap-2">
                    <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>by {file.uploaded_by}</span>
                </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                    href={file.file_path}
                    download
                    className="p-2 text-text-secondary hover:text-primary hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Download"
                >
                    <Download size={18} />
                </a>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="p-2 text-text-secondary hover:text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                >
                    {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
            </div>
        </div>
    );
}
