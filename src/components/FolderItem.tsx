"use client";

import { Folder, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface FolderItemProps {
    folder: {
        id: number;
        name: string;
        color: string;
    };
    fileCount: number;
    onClick: () => void;
    onDelete: (id: number) => void;
    onDrop: (folderId: number, e: React.DragEvent) => void;
}

export function FolderItem({ folder, fileCount, onClick, onDelete, onDrop }: FolderItemProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        onDrop(folder.id, e);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete folder "${folder.name}"? Files will be moved to root.`)) {
            onDelete(folder.id);
        }
        setShowMenu(false);
    };

    return (
        <div
            className={clsx(
                "relative p-4 border-2 rounded-xl cursor-pointer transition-all group",
                isDragOver
                    ? "border-primary bg-blue-50/50 scale-105"
                    : "border-border hover:border-primary/50 hover:shadow-md"
            )}
            onClick={onClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: folder.color }}
                >
                    <Folder size={24} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary truncate">{folder.name}</div>
                    <div className="text-xs text-text-secondary">
                        {fileCount} {fileCount === 1 ? 'file' : 'files'}
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-background rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical size={18} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-2 text-left text-sm text-error hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isDragOver && (
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-xl bg-blue-50/30 flex items-center justify-center pointer-events-none">
                    <span className="text-primary font-medium">Drop file here</span>
                </div>
            )}
        </div>
    );
}
