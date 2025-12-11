"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File as FileIcon, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import clsx from "clsx";

export function FileUploader({ onUploadComplete }: { onUploadComplete?: () => void }) {
    const router = useRouter();
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Handler for drag events
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        setUploading(true);
        // Process each file
        for (let i = 0; i < files.length; i++) {
            await uploadFile(files[i]);
        }
        setUploading(false);
        // Refresh server components to show new file
        router.refresh();
        // Call callback if provided
        if (onUploadComplete) {
            onUploadComplete();
        }
    };

    const uploadFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/files/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            // Success feedback could be toast
            alert(`Uploaded ${file.name}`);
        } catch (err) {
            console.error(err);
            alert(`Error uploading ${file.name}`);
        }
    };

    return (
        <div className="mb-8">
            <div
                className={clsx(
                    "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    dragActive ? "border-primary bg-blue-50/50" : "border-border hover:border-primary hover:bg-background",
                    uploading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-2">
                        {uploading ? <Loader2 className="animate-spin" size={32} /> : <UploadCloud size={32} />}
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                        {uploading ? "Uploading..." : "Drag & Drop files here"}
                    </h3>
                    <p className="text-sm text-text-secondary">or click to browse</p>
                </div>
            </div>
            <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={handleChange}
            />
        </div>
    );
}
