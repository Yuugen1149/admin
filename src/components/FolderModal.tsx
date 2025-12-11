"use client";

import { useState } from "react";
import { X, FolderPlus } from "lucide-react";
import clsx from "clsx";

interface FolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; color: string }) => void;
}

const FOLDER_COLORS = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Orange", value: "#F59E0B" },
    { name: "Red", value: "#EF4444" },
];

export function FolderModal({ isOpen, onClose, onSubmit }: FolderModalProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState(FOLDER_COLORS[0].value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSubmit({ name: name.trim(), color });
        setName("");
        setColor(FOLDER_COLORS[0].value);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <FolderPlus size={24} className="text-primary" />
                        Create New Folder
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background rounded-lg transition-colors text-text-secondary"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter folder name..."
                            className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-text-primary focus:border-primary focus:outline-none"
                            autoFocus
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-primary mb-3">
                            Folder Color
                        </label>
                        <div className="grid grid-cols-6 gap-3">
                            {FOLDER_COLORS.map((folderColor) => (
                                <button
                                    key={folderColor.value}
                                    type="button"
                                    onClick={() => setColor(folderColor.value)}
                                    className={clsx(
                                        "w-10 h-10 rounded-lg transition-all",
                                        color === folderColor.value && "ring-2 ring-offset-2 ring-primary scale-110"
                                    )}
                                    style={{ backgroundColor: folderColor.value }}
                                    title={folderColor.name}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-border rounded-xl font-medium text-text-secondary hover:bg-background transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create Folder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
