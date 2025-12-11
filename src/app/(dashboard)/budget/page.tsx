"use client";

import { useEffect, useState } from "react";
import { Wallet, PieChart, AlertCircle, Save, RotateCcw, IndianRupee } from "lucide-react";
import clsx from "clsx";

interface ForumBudget {
    id: number;
    forum_name: string;
    allocated_amount: number;
    spent_amount: number;
}

interface BudgetData {
    total_budget: number;
    last_updated: string;
    allocations: ForumBudget[];
}

export default function BudgetPage() {
    const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    // Edits
    const [editTotal, setEditTotal] = useState<string>("0");
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState<{ id: number, amount: number } | null>(null);
    const [editingForumName, setEditingForumName] = useState<{ id: number, name: string } | null>(null);

    const canEdit = ['Treasurer', 'Subtreasurer', 'Chair', 'Vice Chair', 'Admin'].includes(userRole);

    useEffect(() => {
        // Fetch User Info from cookies (client-side simple check, real check is API)
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const role = decodeURIComponent(getCookie("user_role") || "");
        const name = decodeURIComponent(getCookie("user_name") || "");
        setUserRole(role);
        setUserName(name);

        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        try {
            const res = await fetch("/api/budget");
            const data = await res.json();
            setBudgetData(data);
            setEditTotal(data.total_budget.toString());
        } catch (error) {
            console.error("Failed to fetch budget", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTotal = async () => {
        if (!confirm("Are you sure you want to update the Total Budget?")) return;

        try {
            const res = await fetch("/api/budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    total_amount: Number(editTotal.replace(/,/g, '')),
                    user_role: userRole,
                    user_name: userName
                })
            });

            if (res.ok) {
                await fetchBudget();
                setIsEditingTotal(false);
            } else {
                alert("Failed to update: Access Denied");
            }
        } catch (error) {
            alert("Error updating budget");
        }
    };

    const handleUpdateAllocation = async (forumId: number) => {
        if (!editingAllocation) return;

        try {
            const res = await fetch("/api/budget/allocate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    forum_id: forumId,
                    amount: editingAllocation.amount,
                    user_role: userRole
                })
            });

            if (res.ok) {
                await fetchBudget();
                setEditingAllocation(null);
            } else {
                alert("Failed to allocate: Access Denied");
            }
        } catch (error) {
            alert("Error allocating budget");
        }
    };

    const handleAddForum = async () => {
        const name = prompt("Enter new Forum Name:");
        if (!name) return;

        try {
            const res = await fetch("/api/budget/forum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, user_role: userRole })
            });

            if (res.ok) {
                await fetchBudget();
            } else {
                alert("Failed to create forum");
            }
        } catch (error) {
            alert("Error creating forum");
        }
    };

    const handleUpdateForumName = async (id: number) => {
        if (!editingForumName) return;

        try {
            const res = await fetch("/api/budget/forum", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, name: editingForumName.name, user_role: userRole })
            });

            if (res.ok) {
                await fetchBudget();
                setEditingForumName(null);
            } else {
                alert("Failed to update name");
            }
        } catch (error) {
            alert("Error updating name");
        }
    };

    if (loading) return <div className="p-8 text-center text-text-tertiary">Loading Budget...</div>;

    const totalAllocated = budgetData?.allocations.reduce((sum, item) => sum + item.allocated_amount, 0) || 0;
    const remainingBudget = (budgetData?.total_budget || 0) - totalAllocated;

    return (
        <div className="p-8 pb-32 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 mb-2">
                    Budget Management
                </h1>
                <p className="text-text-secondary">Manage annual budget and forum allocations</p>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Budget Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <IndianRupee size={150} />
                    </div>
                    <h3 className="text-blue-100 font-medium mb-1">Total Annual Budget</h3>

                    {isEditingTotal ? (
                        <div className="flex gap-2 mt-2 relative z-10">
                            <input
                                type="text"
                                value={editTotal}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setEditTotal(val);
                                    }
                                }}
                                className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none"
                            />
                            <button onClick={handleUpdateTotal} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                                <Save size={20} />
                            </button>
                            <button onClick={() => setIsEditingTotal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                                <RotateCcw size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-end gap-3 relative z-10">
                            <div className="text-4xl font-bold">₹{budgetData?.total_budget.toLocaleString()}</div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditingTotal(true)}
                                    className="text-white/60 hover:text-white text-xs bg-white/10 px-2 py-1 rounded mb-1 transition-colors"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    )}
                    <div className="text-xs text-blue-100/60 mt-4">Last updated: {new Date(budgetData?.last_updated || "").toLocaleDateString()}</div>
                </div>

                {/* Remaining Budget Card */}
                <div className={clsx(
                    "rounded-2xl p-6 text-white shadow-lg relative overflow-hidden",
                    remainingBudget >= 0 ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-red-600"
                )}>
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <IndianRupee size={150} />
                    </div>
                    <h3 className="text-white/80 font-medium mb-1">Remaining to Allocate</h3>
                    <div className="text-4xl font-bold">₹{remainingBudget.toLocaleString()}</div>
                    <div className="text-xs text-white/60 mt-4">Available for future requests</div>
                </div>

                {/* Info Card */}
                <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-text-secondary mb-2">
                        <AlertCircle size={20} />
                        <span className="font-medium">Budget Status</span>
                    </div>
                    <p className="text-sm text-text-tertiary">
                        {remainingBudget < 0
                            ? "⚠️ Warning: You have allocated more than the total budget."
                            : "Budget is healthy. You can allocate more funds to specific forums."}
                    </p>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                        <div
                            className={clsx("h-2 rounded-full", remainingBudget < 0 ? "bg-red-500" : "bg-blue-500")}
                            style={{ width: `${Math.min(((totalAllocated) / (budgetData?.total_budget || 1)) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-text-tertiary mt-1">
                        <span>Allocated: {Math.round(((totalAllocated) / (budgetData?.total_budget || 1)) * 100)}%</span>
                    </div>
                </div>
            </div>

            {/* Allocation List */}
            <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-text-primary">Forum Allocations</h3>
                    {canEdit && (
                        <button
                            onClick={handleAddForum}
                            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Wallet size={16} />
                            Add Forum
                        </button>
                    )}
                </div>

                <div className="grid gap-4">
                    {budgetData?.allocations.map((forum) => (
                        <div key={forum.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4 mb-3 md:mb-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold">
                                    {forum.forum_name.charAt(0)}
                                </div>
                                {editingForumName?.id === forum.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editingForumName.name}
                                            onChange={(e) => setEditingForumName({ ...editingForumName, name: e.target.value })}
                                            className="px-2 py-1 border border-primary rounded text-sm focus:outline-none"
                                            autoFocus
                                            onKeyDown={(e) => e.key === "Enter" && handleUpdateForumName(forum.id)}
                                        />
                                        <button onClick={() => handleUpdateForumName(forum.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                                            <Save size={16} />
                                        </button>
                                        <button onClick={() => setEditingForumName(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                            <RotateCcw size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="group/name flex items-center gap-2">
                                        <div className="font-semibold text-text-primary">{forum.forum_name}</div>
                                        {canEdit && (
                                            <button
                                                onClick={() => setEditingForumName({ id: forum.id, name: forum.forum_name })}
                                                className="text-text-tertiary hover:text-primary transition-colors"
                                                title="Rename Forum"
                                            >
                                                <PieChart size={14} className="rotate-90" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-xs text-text-tertiary px-1">Allocated Amount</div>

                                    {editingAllocation?.id === forum.id ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="number"
                                                autoFocus
                                                className="w-32 px-2 py-1 border border-primary rounded text-sm focus:outline-none"
                                                value={editingAllocation.amount}
                                                onChange={(e) => setEditingAllocation({ ...editingAllocation, amount: Number(e.target.value) })}
                                                onKeyDown={(e) => e.key === "Enter" && handleUpdateAllocation(forum.id)}
                                            />
                                            <button onClick={() => handleUpdateAllocation(forum.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                                                <Save size={16} />
                                            </button>
                                            <button onClick={() => setEditingAllocation(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <RotateCcw size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="font-bold text-lg text-text-primary">₹{forum.allocated_amount.toLocaleString()}</div>
                                            {canEdit && (
                                                <button
                                                    onClick={() => setEditingAllocation({ id: forum.id, amount: forum.allocated_amount })}
                                                    className="text-primary hover:bg-blue-50 p-1 rounded transition-colors"
                                                    title="Edit Allocation"
                                                >
                                                    <Wallet size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
