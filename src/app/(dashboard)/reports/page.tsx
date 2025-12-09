import { FileUploader } from "@/components/FileUploader";
import { FileItem } from "@/components/FileItem";
import { db } from "@/lib/db";
import { FileIcon, Download, Trash2, Search, Filter } from "lucide-react";

// Server Component
export default async function ReportsPage() {
    const files = await db.files.findAll();

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">Reports & Files</h1>
                <p className="text-text-secondary">Manage and organize your documents.</p>
            </header>

            {/* Upload Zone */}
            <section className="bg-surface p-6 rounded-2xl shadow-sm mb-8">
                <h2 className="text-lg font-bold mb-4 text-text-primary">Upload New File</h2>
                <FileUploader />
            </section>

            {/* File List */}
            <section className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                    <h2 className="text-lg font-bold text-text-primary">Uploaded Files</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                            <input
                                type="text"
                                placeholder="Search files..."
                                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                            />
                        </div>
                        <button className="p-2 border border-border rounded-lg hover:bg-background text-text-secondary">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="min-h-[300px]">
                    {files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
                            <FileIcon size={48} className="mb-4 opacity-50" />
                            <p>No files uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {files.map((file) => (
                                <FileItem key={file.id} file={file} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
