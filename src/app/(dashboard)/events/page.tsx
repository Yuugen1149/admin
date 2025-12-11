"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Trash2, Calendar } from "lucide-react";
import clsx from "clsx";
import useSWR from "swr";
import { EventModal } from "@/components/EventModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CalendarEvent {
    id: number;
    title: string;
    date: string;
    type: string;
    description: string;
}

interface User {
    name: string;
    role: string;
}

export default function EventsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [userRole, setUserRole] = useState<string>("");

    const { data: events, mutate } = useSWR<CalendarEvent[]>('/api/events', fetcher);
    const { data: user } = useSWR<User>('/api/user', fetcher);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Update user role when user data is fetched
    useEffect(() => {
        if (user?.role) {
            setUserRole(user.role);
        }
    }, [user]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Adjust for timezone offset to ensure form opens with correct local date
        const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

        setSelectedDate(offsetDate);
        setIsModalOpen(true);
    };

    const handleCreateEvent = async (data: any) => {
        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            mutate();
            setIsModalOpen(false);
        } catch (e) {
            alert("Failed to create event");
        }
    };

    const handleDeleteEvent = async (eventId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering date click

        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const res = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete event');
            }

            mutate(); // Refresh events list
        } catch (error: any) {
            alert(error.message);
        }
    };

    const getEventsForDay = (day: number) => {
        if (!events) return [];
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        // Simple string comparison for MVP. Needs better handling for timezones in production.
        return events.filter(e => e.date === dateStr);
    };

    const renderCalendar = () => {
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (day === null) return <div key={`blank-${index}`} className="h-32 bg-gray-50/50 border border-border/50" />;

            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
                <div
                    key={day}
                    className={clsx(
                        "h-32 border border-border p-2 transition-colors hover:bg-blue-50/30 cursor-pointer relative group",
                        isToday && "bg-blue-50/20"
                    )}
                    onClick={() => handleDateClick(day)}
                >
                    <div className={clsx(
                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1",
                        isToday ? "bg-primary text-white" : "text-text-secondary"
                    )}>
                        {day}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                className={clsx(
                                    "text-xs px-2 py-1 rounded-md mb-1 font-medium truncate",
                                    event.type === 'meeting' ? "bg-blue-100 text-blue-700" :
                                        event.type === 'deadline' ? "bg-red-100 text-red-700" :
                                            "bg-green-100 text-green-700"
                                )}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>

                    <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-primary text-white rounded-md shadow-sm transition-opacity">
                        <Plus size={14} />
                    </button>
                </div>
            );
        });
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-text-primary">Events Calendar</h1>
                    <p className="text-text-secondary">Manage upcoming activities and deadlines.</p>
                </div>
                <button
                    onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
                    className="btn-primary"
                >
                    Add Event
                </button>
            </header>

            <div className="bg-surface rounded-2xl shadow-sm border border-border flex flex-col flex-1 overflow-hidden">
                {/* Calendar Controls */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-text-primary">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrevMonth} className="p-2 border border-border bg-white rounded-lg hover:bg-gray-100 text-text-secondary">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 border border-border bg-white rounded-lg hover:bg-gray-100 text-text-secondary font-medium">
                            Today
                        </button>
                        <button onClick={handleNextMonth} className="p-2 border border-border bg-white rounded-lg hover:bg-gray-100 text-text-secondary">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-border bg-background">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-3 text-center text-sm font-semibold text-text-tertiary uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 bg-background">
                    {renderCalendar()}
                </div>
            </div>

            {/* Events List Section */}
            <div className="mt-8 bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-gray-50">
                    <h2 className="text-xl font-bold text-text-primary">All Events</h2>
                    <p className="text-sm text-text-secondary mt-1">Complete list of scheduled events</p>
                </div>

                <div className="p-6">
                    {!events || events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar size={48} className="mx-auto text-text-tertiary mb-4" />
                            <p className="text-text-secondary">No events scheduled yet</p>
                            <button
                                onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
                                className="mt-4 text-primary hover:underline font-medium"
                            >
                                Create your first event
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[...events]
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map(event => {
                                    const eventDate = new Date(event.date);
                                    const isUpcoming = eventDate >= new Date(new Date().setHours(0, 0, 0, 0));
                                    const isPast = !isUpcoming;
                                    const canDelete = userRole === 'Chair' || userRole === 'Vice Chair' || userRole === 'Admin';

                                    console.log('User role:', userRole, 'Can delete:', canDelete);

                                    return (
                                        <div
                                            key={event.id}
                                            className={clsx(
                                                "border border-border rounded-xl p-4 transition-all hover:shadow-md",
                                                isPast && "opacity-60"
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span
                                                            className={clsx(
                                                                "px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide",
                                                                event.type === 'meeting' ? "bg-blue-100 text-blue-700" :
                                                                    event.type === 'deadline' ? "bg-red-100 text-red-700" :
                                                                        "bg-green-100 text-green-700"
                                                            )}
                                                        >
                                                            {event.type}
                                                        </span>
                                                        {isPast && (
                                                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                                                Past
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-text-primary mb-2">
                                                        {event.title}
                                                    </h3>

                                                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={16} />
                                                            <span>
                                                                {eventDate.toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {event.description && (
                                                        <p className="text-text-secondary text-sm">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {canDelete && (
                                                    <button
                                                        onClick={(e) => handleDeleteEvent(event.id, e)}
                                                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-text-tertiary"
                                                        title="Delete event"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateEvent}
                selectedDate={selectedDate}
            />
        </div>
    );
}
