"use client";

import { StatCard } from "@/components/StatCard";
import { Users, Calendar, Activity, PieChart, Bell, Plus, UserPlus, Send, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl font-semibold hover:bg-background transition-colors cursor-pointer text-text-primary">
            <Bell size={18} />
            Notifications
          </button>
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
          value="17"
          change="+12.5% from last month"
          isPositive={true}
          icon={Users}
          iconBgClass="bg-gradient-to-br from-[#667EEA] to-[#764BA2]"
        />
        <StatCard
          label="Upcoming Events"
          value="3"
          change="No changes"
          isPositive={false}
          icon={Calendar}
          iconBgClass="bg-gradient-to-br from-[#F093FB] to-[#F5576C]"
        />
        <StatCard
          label="Active Projects"
          value="5"
          change="+2 new this week"
          isPositive={true}
          icon={Activity}
          iconBgClass="bg-gradient-to-br from-[#4FACFE] to-[#00F2FE]"
        />
        <StatCard
          label="Budget Utilized"
          value="$1,240"
          change="On track"
          isPositive={false}
          icon={PieChart}
          iconBgClass="bg-gradient-to-br from-[#FA709A] to-[#FEE140]"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Activity */}
        <div className="bg-surface rounded-2xl shadow-md overflow-hidden">
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

        {/* Quick Actions */}
        <div className="bg-surface rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 p-2 border-b border-border">Quick Actions</h3>
          <div className="grid gap-3">
            <Link href="/members" className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface hover:bg-background hover:border-primary transition-all text-text-primary font-medium cursor-pointer">
              <UserPlus size={20} className="text-text-secondary" />
              Add Member
            </Link>
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
  );
}
