"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Megaphone, Wallet } from "lucide-react";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { MotionValue } from "framer-motion";
import { Children, cloneElement, isValidElement, ReactElement } from "react";
import clsx from "clsx";

interface NavigationDockProps {
    user: {
        name: string;
        role: string;
    };
}

interface DockLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
    width?: MotionValue<number>;
    isHovered?: MotionValue<number>;
}

const DockLink = ({ href, className, children, width, isHovered }: DockLinkProps) => {
    return (
        <Link href={href} className={className}>
            {Children.map(children, (child) => {
                if (isValidElement(child) && typeof child.type !== 'string') {
                    return cloneElement(child, { width, isHovered } as any);
                }
                return child;
            })}
        </Link>
    );
};

interface DockButtonProps {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    width?: MotionValue<number>;
    isHovered?: MotionValue<number>;
}

const DockButton = ({ onClick, className, children, width, isHovered }: DockButtonProps) => {
    return (
        <button onClick={onClick} className={className}>
            {Children.map(children, (child) => {
                if (isValidElement(child) && typeof child.type !== 'string') {
                    return cloneElement(child, { width, isHovered } as any);
                }
                return child;
            })}
        </button>
    );
};

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Budget", href: "/budget", icon: Wallet },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function NavigationDock({ user }: NavigationDockProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] w-fit'>
            <Dock className='items-end pb-3 bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-4 overflow-x-auto touch-pan-x custom-scrollbar-hide'>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <DockItem
                            key={item.href}
                            className={clsx(
                                'aspect-square rounded-2xl transition-all duration-300 ease-out',
                                isActive ? 'bg-white/20 ring-1 ring-white/30' : 'hover:bg-white/10'
                            )}
                        >
                            <DockLink href={item.href} className="w-full h-full flex items-center justify-center p-2 relative group">
                                <DockLabel>{item.name}</DockLabel>
                                <DockIcon>
                                    <item.icon className={clsx("w-full h-full transition-all duration-300", isActive ? "text-white" : "text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white")} />
                                </DockIcon>
                                {isActive && (
                                    <div className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                )}
                            </DockLink>
                        </DockItem>
                    );
                })}

                <div className="w-px h-8 bg-white/20 self-center" />

                <DockItem
                    className='aspect-square rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all duration-300'
                >
                    <DockLink href="#" className="w-full h-full flex items-center justify-center p-2 relative group cursor-default">
                        <DockLabel>{user.name}</DockLabel>
                        <DockIcon>
                            <img
                                src="/icons/user.svg"
                                alt="Profile"
                                className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                            />
                        </DockIcon>
                    </DockLink>
                </DockItem>

                <DockItem
                    className='aspect-square rounded-2xl hover:bg-red-500/10 text-neutral-500 dark:text-neutral-400 hover:text-red-500 transition-all duration-300'
                >
                    <DockButton onClick={handleLogout} className="w-full h-full flex items-center justify-center p-3 relative group">
                        <DockLabel>Logout</DockLabel>
                        <DockIcon>
                            <LogOut className="w-full h-full group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                        </DockIcon>
                    </DockButton>
                </DockItem>
            </Dock>
        </div>
    );
}
