"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Megaphone } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    user: {
        name: string;
        role: string;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-[280px] flex flex-col border-r border-border bg-surface z-50">
            <div className="flex items-center gap-3 p-6 border-b border-border">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 64 64" fill="none" className="scale-125">
                        <circle cx="32" cy="32" r="6" fill="white" />
                        <circle cx="20" cy="20" r="4" fill="white" />
                        <circle cx="44" cy="20" r="4" fill="white" />
                        <circle cx="20" cy="44" r="4" fill="white" />
                        <circle cx="44" cy="44" r="4" fill="white" />
                        <line x1="32" y1="32" x2="20" y2="20" stroke="white" strokeWidth="2" />
                        <line x1="32" y1="32" x2="44" y2="20" stroke="white" strokeWidth="2" />
                        <line x1="32" y1="32" x2="20" y2="44" stroke="white" strokeWidth="2" />
                        <line x1="32" y1="32" x2="44" y2="44" stroke="white" strokeWidth="2" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary">Admin Panel</h2>
            </div>

            <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-br from-[#667EEA] to-[#764BA2] text-white shadow-md btn-primary"
                                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                            )}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667EEA] to-[#764BA2] flex items-center justify-center text-white font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-text-primary truncate">{user.name}</div>
                        <div className="text-xs text-text-secondary truncate">{user.role}</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-error hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
