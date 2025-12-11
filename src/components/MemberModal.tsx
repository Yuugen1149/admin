"use client";

import { X, User, Mail, Phone, Lock, Briefcase } from "lucide-react";
import { useState } from "react";

interface MemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export function MemberModal({ isOpen, onClose, onSubmit }: MemberModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
            password: formData.get('password')
        };

        try {
            await onSubmit(data);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in fade-in zoom-in duration-200">
                <header className="px-6 py-4 border-b border-border flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-text-primary">Add New Member</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-text-secondary transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="name"
                                required
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="john@example.com"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <input
                                    name="phone"
                                    placeholder="123-456-7890"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                                <select name="role" required className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none bg-white">
                                    <option value="Member">Member</option>
                                    <option value="Secretary">Secretary</option>
                                    <option value="Vice Chair">Vice Chair</option>
                                    <option value="Chair">Chair</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Set initial password"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-text-secondary hover:bg-gray-50 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
                            {isLoading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
