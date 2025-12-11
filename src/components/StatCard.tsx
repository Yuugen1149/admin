import { LucideIcon, Edit2 } from "lucide-react";
import clsx from "clsx";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import React from "react";

interface StatCardProps {
    label: string;
    value: React.ReactNode;
    change: string;
    isPositive: boolean;
    icon: any;
    iconBgClass: string;
    onEdit?: () => void; // Optional edit handler
}

export function StatCard({ label, value, change, isPositive, icon: Icon, iconBgClass, onEdit }: StatCardProps) {
    return (
        <div className="relative rounded-xl group/card">
            <GlowingEffect
                disabled={false}
                glow={true}
                proximity={64}
                spread={40}
                inactiveZone={0.01}
                borderWidth={2}
                movementDuration={1.5}
            />
            <div className="relative bg-surface p-6 rounded-xl shadow-md flex gap-4 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div
                    className={clsx("w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-white", iconBgClass)}
                >
                    <Icon size={24} strokeWidth={2} />
                </div>
                <div className="flex-1">
                    <div className="text-sm text-text-secondary mb-1 flex justify-between items-center">
                        {label}
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-all text-text-tertiary hover:text-primary"
                                title="Edit Value"
                            >
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                    <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
                    {change && (
                        <div className={clsx("text-xs font-medium", isPositive ? "text-success" : "text-text-secondary")}>
                            {change}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
