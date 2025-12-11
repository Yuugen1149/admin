"use client";

import { StatCard } from "@/components/StatCard";
import { Users, Calendar, Activity, PieChart, Plus, UserPlus, Send, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useEffect, useState } from "react";
import { MemberModal } from "@/components/MemberModal";

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

  const canEdit = ['chair', 'vice chair', 'secretary', 'admin'].includes(user.role?.toLowerCase());

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
  }, []);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleEdit = async (field: keyof typeof metrics, currentVal: string) => {
    if (!canEdit) return;
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
    <div className="p-8">
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
          onEdit={canEdit ? () => handleEdit('total_members', metrics.total_members) : undefined}
        />
        <StatCard
          label="Upcoming Events"
          value={metrics.upcoming_events}
          change="No changes"
          isPositive={false}
          icon={Calendar}
          iconBgClass="bg-gradient-to-br from-[#F093FB] to-[#F5576C]"
          onEdit={canEdit ? () => handleEdit('upcoming_events', metrics.upcoming_events) : undefined}
        />
        <StatCard
          label="Active Projects"
          value={metrics.active_projects}
          change="+2 new this week"
          isPositive={true}
          icon={Activity}
          iconBgClass="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE]"
          onEdit={canEdit ? () => handleEdit('active_projects', metrics.active_projects) : undefined}
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
              {/* Activity Items */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5] shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary mb-1">Tech Talk 2024</div>
                  <div className="text-xs text-text-secondary">Tomorrow at 10:00 AM</div>
                </div>
                <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#E0E7FF] text-[#4F46E5]">Upcoming</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary mb-1">Workshop Planning</div>
                  <div className="text-xs text-text-secondary">In Progress</div>
                </div>
                <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">In Progress</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] flex items-center justify-center text-[#059669] shrink-0">
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary mb-1">New Member Orientation</div>
                  <div className="text-xs text-text-secondary">Completed yesterday</div>
                </div>
                <div className="px-3 py-1 rounded-md text-xs font-semibold bg-[#D1FAE5] text-[#059669]">Completed</div>
              </div>
            </div>
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
                  if (canEdit) setIsAddMemberOpen(true);
                }}
                className={`flex items-center gap-3 p-4 border border-border rounded-xl bg-surface transition-all text-text-primary font-medium ${canEdit
                  ? "hover:bg-background hover:border-primary cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
                  }`}
              >
                {canEdit ? (
                  <UserPlus size={20} className="text-text-secondary" />
                ) : (
                  <Lock size={20} className="text-text-secondary" />
                )}
                Add Member
              </div>
              <Link href="/events" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover:bg-background hover:border-primary transition-all text-text-primary font-medium cursor-pointer">
                <Calendar size={20} className="text-text-secondary" />
                Create Event
              </Link>
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
      </div>
      <MemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={handleAddMemberSubmit}
      />
    </div>
  );
}
