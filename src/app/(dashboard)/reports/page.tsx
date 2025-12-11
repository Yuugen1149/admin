"use client";

import { FileUploader } from "@/components/FileUploader";
import { FileItem } from "@/components/FileItem";
import { FolderModal } from "@/components/FolderModal";
import { FolderItem } from "@/components/FolderItem";
import { FileIcon, Search, Filter, FolderPlus, Home, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Folder {
    id: number;
    name: string;
    color: string;
}

interface File {
    id: number;
    filename: string;
    original_name: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    file_path: string;
    uploaded_at: string;
    folder_id?: number | null;
}

export default function ReportsPage() {
    const router = useRouter();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [currentFolder, setCurrentFolder] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [foldersRes, filesRes] = await Promise.all([
                fetch('/api/folders'),
                fetch('/api/files')
            ]);

            if (foldersRes.ok) {
                const foldersData = await foldersRes.json();
                setFolders(foldersData);
            }

            if (filesRes.ok) {
                const filesData = await filesRes.json();
                setFiles(filesData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async (data: { name: string; color: string }) => {
        try {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                fetchData();
            } else {
                alert('Failed to create folder');
            }
        } catch (error) {
            alert('Error creating folder');
        }
    };

    const handleDeleteFolder = async (folderId: number) => {
        try {
            const res = await fetch(`/api/folders/${folderId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchData();
                if (currentFolder === folderId) {
                    setCurrentFolder(null);
                }
            } else {
                alert('Failed to delete folder');
            }
        } catch (error) {
            alert('Error deleting folder');
        }
    };

    const handleFileDrop = async (folderId: number, e: React.DragEvent) => {
        e.preventDefault();
        const fileId = e.dataTransfer.getData('fileId');
        if (!fileId) return;

        try {
            const res = await fetch(`/api/files/${fileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder_id: folderId })
            });

            if (res.ok) {
                await fetchData();
            } else {
                alert('Failed to move file');
            }
        } catch (error) {
            console.error('Error moving file:', error);
            alert('Error moving file');
        }
    };

    const currentFolderData = folders.find(f => f.id === currentFolder);

    let displayedFiles = currentFolder === null
        ? files.filter(f => !f.folder_id)
        : files.filter(f => f.folder_id === currentFolder);

    // Apply search filter
    if (searchQuery.trim()) {
        displayedFiles = displayedFiles.filter(file =>
            file.original_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const getFileCountForFolder = (folderId: number) => {
        return files.filter(f => f.folder_id === folderId).length;
    };

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">Reports & Files</h1>
                <p className="text-text-secondary">Manage and organize your documents.</p>
            </header>

            {/* Upload Zone */}
            <section className="bg-surface p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-lg font-bold mb-4 text-text-primary">Upload New File</h2>
                <FileUploader onUploadComplete={fetchData} />
            </section>

            {/* Folders Section */}
            {folders.length > 0 && (
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-text-primary">Folders</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <FolderPlus size={18} />
                            New Folder
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {folders.map(folder => (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                fileCount={getFileCountForFolder(folder.id)}
                                onClick={() => setCurrentFolder(folder.id)}
                                onDelete={handleDeleteFolder}
                                onDrop={handleFileDrop}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* File List */}
            <section className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-text-primary">
                            {currentFolder ? currentFolderData?.name : 'All Files'}
                        </h2>
                        {currentFolder && (
                            <button
                                onClick={() => setCurrentFolder(null)}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                                <Home size={14} />
                                Back to Root
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {folders.length === 0 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                            >
                                <FolderPlus size={18} />
                                Create Folder
                            </button>
                        )}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <button className="p-2 border border-border rounded-lg hover:bg-background text-text-secondary">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-text-tertiary">
                            Loading...
                        </div>
                    ) : displayedFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
                            <FileIcon size={48} className="mb-4 opacity-50" />
                            <p>No files {currentFolder ? 'in this folder' : 'uploaded yet'}.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {displayedFiles.map((file) => (
                                <FileItem key={file.id} file={file} onDelete={fetchData} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <FolderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateFolder}
            />
        </div>
    );
}
