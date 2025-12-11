"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Check, Palette, Lock } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

const COLORS = [
    { name: "Blue", value: "#2563EB" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Green", value: "#059669" },
    { name: "Red", value: "#DC2626" },
    { name: "Orange", value: "#EA580C" },
    { name: "Black", value: "#000000" },
];

export default function SettingsPage() {
    const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();

    return (
        <div className="p-8 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-text-primary">Settings</h1>
                <p className="text-text-secondary">Customize your workspace preferences.</p>
            </header>

            <div className="space-y-8">
                {/* Debug Banner - Temporary */}
                <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                    <p className="font-bold">Debug Info:</p>
                    <p>Detected Role (Cookie): "{decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1] || '')}"</p>
                    <p>Normalized Role: "{decodeURIComponent(document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1] || '').toLowerCase().trim()}"</p>
                </div>

                {/* Appearance Section */}
                <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                        <Palette size={24} className="text-primary" />
                        Appearance
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Theme Toggle */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Theme Mode</h3>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        theme === "light" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                    )}
                                >
                                    <Sun size={18} /> Light
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        theme === "dark" ? "bg-gray-700 shadow-sm text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                    )}
                                >
                                    <Moon size={18} /> Dark
                                </button>
                            </div>
                        </div>

                        {/* Primary Color */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Primary Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setPrimaryColor(color.value)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-gray-200"
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    >
                                        {primaryColor === color.value && <Check size={18} className="text-white drop-shadow-md" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Permissions Section - Only visible to Chair, Vice Chair, Admin */}
                <PermissionsSection />

                {/* Account Section (Placeholder) */}
                <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border opacity-60">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Account</h2>
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse"></div>
                        <div className="h-10 bg-gray-100 rounded-lg w-3/4 animate-pulse"></div>
                        <p className="text-sm text-text-secondary">Account settings coming soon...</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function PermissionsSection() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Get user role
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const role = decodeURIComponent(getCookie("user_role") || "").toLowerCase().trim();
        setUserRole(role);

        if (role === 'chair') {
            fetchPermissions();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchPermissions = async () => {
        try {
            const res = await fetch('/api/settings/permissions');
            const data = await res.json();
            if (Array.isArray(data)) {
                setPermissions(data);
            }
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (action: string, role: string) => {
        const currentPerm = permissions.find(p => p.action_key === action) || { action_key: action, allowed_roles: [] };
        const currentRoles = currentPerm.allowed_roles || [];

        let newRoles;
        if (currentRoles.includes(role)) {
            newRoles = currentRoles.filter((r: string) => r !== role);
        } else {
            newRoles = [...currentRoles, role];
        }

        // Optimistic update
        setPermissions(prev => {
            const existing = prev.find(p => p.action_key === action);
            if (existing) {
                return prev.map(p => p.action_key === action ? { ...p, allowed_roles: newRoles } : p);
            } else {
                return [...prev, { action_key: action, allowed_roles: newRoles }];
            }
        });

        try {
            await fetch('/api/settings/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action_key: action, allowed_roles: newRoles })
            });
        } catch (error) {
            console.error("Failed to update permission", error);
            fetchPermissions(); // Revert on error
        }
    };

    if (userRole !== 'chair') return null;

    const ACTIONS = [
        { key: 'edit_metrics', label: 'Edit Dashboard Metrics' },
        { key: 'delete_events', label: 'Delete Events' },
        { key: 'add_members', label: 'Add Members' },
        { key: 'create_event', label: 'Create Events' },
    ];

    const ROLES = ['chair', 'vice chair', 'secretary', 'joint secretary', 'treasurer', 'member'];

    return (
        <section className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Lock size={24} className="text-primary" />
                Permissions & Roles
            </h2>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-text-secondary uppercase bg-background">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Action</th>
                                {ROLES.map(role => (
                                    <th key={role} className="px-4 py-3 text-center capitalize">{role}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ACTIONS.map((action) => {
                                const perm = permissions.find(p => p.action_key === action.key);
                                const allowedRoles = perm?.allowed_roles || [];

                                return (
                                    <tr key={action.key} className="border-b border-border last:border-0 hover:bg-background/50">
                                        <td className="px-4 py-3 font-medium text-text-primary">{action.label}</td>
                                        {ROLES.map(role => {
                                            const isAllowed = allowedRoles.includes(role);
                                            // Chair always has permission typically, but let's make it configurable or locked checked
                                            const isLocked = role === 'chair' && action.key !== 'delete_events'; // Example logic

                                            return (
                                                <td key={role} className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllowed}
                                                        onChange={() => handleToggle(action.key, role)}
                                                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary"
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
