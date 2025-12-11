"use client";

import { StatCard } from "@/components/StatCard";
import { Users, Calendar, Activity, PieChart, Plus, UserPlus, Send, FileText, Lock, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useEffect, useState } from "react";
import { MemberModal } from "@/components/MemberModal";
import clsx from "clsx";

const BudgetStatus = () => {
  const [budget, setBudget] = useState<{ total: number, remaining: number } | null>(null);

  useEffect(() => {
    fetch('/api/budget').then(res => res.json()).then(data => {
      const allocated = data.allocations.reduce((sum: number, item: any) => sum + item.allocated_amount, 0);
      setBudget({ total: data.total_budget, remaining: data.total_budget - allocated });
    }).catch(err => console.error("Budget fetch error", err));
  }, []);

  if (!budget) return <span className="text-sm">Loading...</span>;

  return (
    <div className="flex flex-col text-sm">
      <span>₹{budget.remaining.toLocaleString()} Left</span>
      <span className="text-xs opacity-70">of ₹{budget.total.toLocaleString()}</span>
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState({ name: '', role: '' });
  const [metrics, setMetrics] = useState({
    total_members: '17',
    upcoming_events: '3',
    active_projects: '5'
  });

  const [permissions, setPermissions] = useState<any[]>([]);

  const canEdit = ['chair', 'vice chair', 'secretary', 'admin'].includes(user.role?.toLowerCase());

  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    // Get User Info
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const name = decodeURIComponent(getCookie("user_name") || "");
    const role = decodeURIComponent(getCookie("user_role") || "");
    console.log("Logged in as:", { name, role });
    setUser({ name, role });

    // Fetch Metrics
    fetch('/api/dashboard/metrics')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMetrics({
            total_members: data.total_members,
            upcoming_events: data.upcoming_events,
            active_projects: data.active_projects
          });
        }
      })
      .catch(err => console.error("Metrics fetch error", err));

    // Fetch Recent Events
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const now = new Date();
          const upcoming = data
            .filter((e: any) => new Date(e.date) >= now || new Date(e.date).toDateString() === now.toDateString())
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
          setRecentEvents(upcoming);
        }
      })
      .catch(err => console.error("Events fetch error", err));

    // Fetch Permissions
    fetch('/api/settings/permissions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPermissions(data);
        }
      })
      .catch(err => console.error("Permissions fetch error", err));
  }, []);

  const hasPermission = (action: string) => {
    // Chair always has permission in this logic, or we can rely solely on DB
    if (user.role?.toLowerCase() === 'chair') return true;

    const perm = permissions.find(p => p.action_key === action);
    if (!perm) return false;
    return perm.allowed_roles?.includes(user.role?.toLowerCase());
  };

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleEdit = async (field: keyof typeof metrics, currentVal: string) => {
    if (!hasPermission('edit_metrics')) return;
    const newVal = prompt(`Update ${field.replace('_', ' ')}:`, currentVal);
    if (newVal !== null && newVal !== currentVal) {
      try {
        const res = await fetch('/api/dashboard/metrics', {
          method: 'POST',
          body: JSON.stringify({ [field]: newVal }),
          headers: { 'Content-Type': 'application/json' }
        });

        const text = await res.text();
        console.log("API Response Status:", res.status);
        console.log("API Response Text:", text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { error: "Invalid JSON response" };
        }

        if (res.ok) {
          setMetrics(prev => ({ ...prev, [field]: newVal }));
        } else {
          console.error("Update failed object:", data);
          alert(`Failed to update (${res.status}): ${data.error || text}`);
        }
      } catch (err) {
        console.error("Update error", err);
        alert("Failed to update");
      }
    }
  };

  const handleDeleteEvent = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasPermission('delete_events')) {
      alert("You do not have permission to delete events.");
      return;
    }

    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecentEvents(prev => prev.filter(ev => ev.id !== id));
      } else {
        alert("Failed to delete event");
      }
    } catch (err) {
      console.error("Failed to delete event", err);
      alert("Error deleting event");
    }
  };

  const handleAddMemberSubmit = async (data: any) => {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add member');
    }

    // Optimistically update total members count
    setMetrics(prev => ({
      ...prev,
      total_members: (parseInt(prev.total_members) + 1).toString()
    }));
    alert("Member added successfully!");
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-text-primary capitalize">
            {user.name && user.role ? `${user.name} - ${user.role}` : 'Dashboard'}
          </h1>
          <p className="text-text-secondary">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <NotificationsDropdown />
          <Link href="/events" className="btn-primary">
            <Plus size={18} />
            New Event
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Members"
          value={metrics.total_members}
          change="+12.5% from last month"
          isPositive={true}
          icon={Users}
          iconBgClass="bg-gradient-to-br from-[#667EEA] to-[#764BA2]"
          onEdit={hasPermission('edit_metrics') ? () => handleEdit('total_members', metrics.total_members) : undefined}
        />
        <StatCard
          label="Upcoming Events"
          value={metrics.upcoming_events}
          change="No changes"
          isPositive={false}
          icon={Calendar}
          iconBgClass="bg-gradient-to-br from-[#F093FB] to-[#F5576C]"
          onEdit={hasPermission('edit_metrics') ? () => handleEdit('upcoming_events', metrics.upcoming_events) : undefined}
        />
        <StatCard
          label="Active Projects"
          value={metrics.active_projects}
          change="+2 new this week"
          isPositive={true}
          icon={Activity}
          iconBgClass="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE]"
          onEdit={hasPermission('edit_metrics') ? () => handleEdit('active_projects', metrics.active_projects) : undefined}
        />
        <StatCard
          label="Budget Utilized"
          value={<BudgetStatus />}
          change="Live Status"
          isPositive={true}
          icon={PieChart}
          iconBgClass="bg-gradient-to-br from-[#FA709A] to-[#FEE140]"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Activity */}
        <div className="relative rounded-2xl">
          <GlowingEffect
            disabled={false}
            glow={true}
            proximity={64}
            spread={40}
            inactiveZone={0.01}
            borderWidth={2}
            movementDuration={1.5}
            borderRadius="rounded-2xl"
          />
          <div className="relative bg-surface rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-primary">Recent Events</h3>
              <Link href="/events" className="text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {recentEvents.length > 0 ? (
                recentEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-4 group">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      event.type === 'meeting' ? "bg-blue-100 text-blue-700" :
                        event.type === 'deadline' ? "bg-red-100 text-red-700" :
                          "bg-green-100 text-green-700"
                    )}>
                      {event.type === 'meeting' ? <Users size={18} /> :
                        event.type === 'deadline' ? <Clock size={18} /> :
                          <Calendar size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary mb-1">{event.title}</div>
                      <div className="text-xs text-text-secondary">
                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', hour: 'numeric', minute: 'numeric' })}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={clsx(
                      "px-3 py-1 rounded-md text-xs font-semibold",
                      !hasPermission('delete_events') && (
                        event.type === 'meeting' ? "bg-blue-100 text-blue-700" :
                          event.type === 'deadline' ? "bg-red-100 text-red-700" :
                            "bg-green-100 text-green-700"
                      ),
                      hasPermission('delete_events') && "group-hover:hidden", // Hide badge on hover if editable
                      hasPermission('delete_events') && (
                        event.type === 'meeting' ? "bg-blue-100 text-blue-700" :
                          event.type === 'deadline' ? "bg-red-100 text-red-700" :
                            "bg-green-100 text-green-700"
                      )
                    )}>
                      {event.type}
                    </div>

                    {/* Delete Button (Only visible on hover if canEdit) */}
                    {hasPermission('delete_events') && (
                      <button
                        onClick={(e) => handleDeleteEvent(event.id, e)}
                        className="hidden group-hover:flex p-2 hover:bg-red-50 text-text-tertiary hover:text-red-500 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <p>No upcoming events ordered.</p>
                  <Link href="/events" className="text-primary text-sm hover:underline mt-2 inline-block">Schedule one?</Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative rounded-2xl">
            <GlowingEffect
              disabled={false}
              glow={true}
              proximity={64}
              spread={40}
              inactiveZone={0.01}
              borderWidth={2}
              movementDuration={1.5}
              borderRadius="rounded-2xl"
            />
            <div className="relative bg-surface rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 p-2 border-b border-border">Quick Actions</h3>
              <div className="grid gap-3">
                <div
                  onClick={() => {
                    if (hasPermission('add_members')) setIsAddMemberOpen(true);
                  }}
                  className={`flex items-center gap-3 p-4 border border-border rounded-xl bg-surface transition-all text-text-primary font-medium ${hasPermission('add_members')
                    ? "hover:bg-background hover:border-primary cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                    }`}
                >
                  {hasPermission('add_members') ? (
                    <UserPlus size={20} className="text-text-secondary" />
                  ) : (
                    <Lock size={20} className="text-text-secondary" />
                  )}
                  Add Member
                </div>
                {hasPermission('create_event') ? (
                  <Link href="/events" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover:bg-background hover:border-primary transition-all text-text-primary font-medium cursor-pointer">
                    <Calendar size={20} className="text-text-secondary" />
                    Create Event
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface opacity-60 cursor-not-allowed text-text-primary font-medium">
                    <Lock size={20} className="text-text-secondary" />
                    Create Event
                  </div>
                )}
                <Link href="/announcements" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover:bg-background hover:border-primary transition-all text-text-primary font-medium cursor-pointer">
                  <Send size={20} className="text-text-secondary" />
                  Send Announcement
                </Link>
                <Link href="/reports" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover:bg-background hover:border-primary transition-all text-text-primary font-medium cursor-pointer">
                  <FileText size={20} className="text-text-secondary" />
                  Generate Report
                </Link>
              </div>
            </div>
          </div>
          <MemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            onSubmit={handleAddMemberSubmit}
          />
        </div >
        );
}
