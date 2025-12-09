"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import useSWR from "swr";
import clsx from "clsx";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    priority: 'low' | 'normal' | 'high';
    created_at: string;
}

export default function AnnouncementsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: announcements, mutate } = useSWR<Announcement[]>('/api/announcements', fetcher);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, priority })
            });

            // Reset form
            setTitle('');
            setContent('');
            setPriority('normal');
            setIsCreating(false);
            mutate();
        } catch (error) {
            alert('Failed to create announcement');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
            mutate();
        } catch (error) {
            alert('Failed to delete announcement');
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="text-red-500" size={20} />;
            case 'low':
                return <Info className="text-blue-500" size={20} />;
            default:
                return <AlertTriangle className="text-yellow-500" size={20} />;
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-4 border-l-red-500 bg-red-50/50';
            case 'low':
                return 'border-l-4 border-l-blue-500 bg-blue-50/50';
            default:
                return 'border-l-4 border-l-yellow-500 bg-yellow-50/50';
        }
    };

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-text-primary">Announcements</h1>
                    <p className="text-text-secondary">Share important updates with your team.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="btn-primary"
                >
                    <Plus size={18} />
                    New Announcement
                </button>
            </header>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-surface p-6 rounded-2xl shadow-sm mb-8 border border-border">
                    <h2 className="text-lg font-bold mb-4 text-text-primary">Create Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                                placeholder="Enter announcement title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:outline-none resize-none"
                                placeholder="Enter announcement content"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:border-primary focus:outline-none"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Announcement'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 rounded-lg border border-border hover:bg-background"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {!announcements ? (
                    <div className="text-center py-20 text-text-tertiary">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
                        <Megaphone size={48} className="mb-4 opacity-50" />
                        <p>No announcements yet.</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={clsx(
                                "bg-surface p-6 rounded-2xl shadow-sm",
                                getPriorityClass(announcement.priority)
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    {getPriorityIcon(announcement.priority)}
                                    <h3 className="text-lg font-bold text-text-primary">
                                        {announcement.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="text-text-tertiary hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-text-secondary mb-4 whitespace-pre-wrap">
                                {announcement.content}
                            </p>
                            <div className="flex justify-between items-center text-sm text-text-tertiary">
                                <span>By {announcement.author}</span>
                                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
