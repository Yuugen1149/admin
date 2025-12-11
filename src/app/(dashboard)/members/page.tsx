"use client";

import { useEffect, useState } from "react";
import { MessageCircle, MoreVertical, Search, Filter } from "lucide-react";
import clsx from "clsx";
import { ChatDrawer } from "@/components/ChatDrawer";

// Define Member type locally for now or import from shared types
interface Member {
    id: number;
    name: string;
    role: string;
    status: 'active' | 'offline' | 'busy';
    avatar: string;
    email: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Initial fetch
        fetchMembers();

        // Heartbeat & Refresh Loop
        const interval = setInterval(async () => {
            // Send heartbeat
            await fetch('/api/auth/heartbeat', { method: 'POST' });

            // Refresh list to see others' status
            fetchMembers();
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);

    async function fetchMembers() {
        try {
            const res = await fetch('/api/members');
            const data = await res.json();
            setMembers(data);
        } catch (err) {
            console.error("Failed to fetch members");
        } finally {
            setLoading(false);
        }
    }

    // Filter members based on search query
    const filteredMembers = members.filter(member => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(query) ||
            member.role.toLowerCase().includes(query)
        );
    });

    return (
        <div className="p-8 relative">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-text-primary">Team Members</h1>
                    <p className="text-text-secondary">Collaborate and chat with your team.</p>
                </div>
                <button className="btn-primary">Add Member</button>
            </header>

            {/* Filters */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface focus:border-primary focus:outline-none"
                    />
                </div>
                <button className="p-2.5 border border-border rounded-xl bg-surface hover:bg-gray-50 text-text-secondary">
                    <Filter size={20} />
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-20 text-text-tertiary">Loading members...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow group relative">
                            <div className="absolute top-4 right-4 text-text-tertiary cursor-pointer hover:text-text-primary">
                                <MoreVertical size={20} />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <img
                                        src={member.avatar || `/images/members/${encodeURIComponent(member.name)}.jpg`}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                                        }} alt={member.name}
                                        className="w-20 h-20 rounded-full bg-gray-100 object-cover"
                                    />
                                    <span className={clsx(
                                        "absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white",
                                        member.status === 'active' ? 'bg-green-500' :
                                            member.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                    )} title={member.status} />
                                </div>

                                <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
                                <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                                <p className="text-xs text-text-secondary mb-6">{member.email}</p>

                                <div className="flex gap-2 w-full">
                                    <button
                                        onClick={() => setSelectedMember(member)}
                                        className="flex-1 py-2 px-4 rounded-xl bg-blue-50 text-primary font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={18} />
                                        Chat
                                    </button>
                                    <button className="py-2 px-4 rounded-xl border border-border text-text-secondary font-medium hover:bg-gray-50 transition-colors">
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chat Drawer */}
            <ChatDrawer
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </div>
    );
}
