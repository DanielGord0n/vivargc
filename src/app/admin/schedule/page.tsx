"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

interface ScheduleItem {
    time: string;
    group: string;
}

interface Schedule {
    scarborough: Record<string, ScheduleItem[]>;
    bayview: Record<string, ScheduleItem[]>;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LOCATIONS = [
    { id: "scarborough", name: "Scarborough" },
    { id: "bayview", name: "North York (Bayview)" },
];

export default function ScheduleAdmin() {
    const [schedule, setSchedule] = useState<Schedule>({
        scarborough: {},
        bayview: {},
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("scarborough");

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            setSchedule(data.schedule || { scarborough: {}, bayview: {} });
        } catch (error) {
            console.error("Failed to fetch schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveSchedule = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            data.schedule = schedule;

            const saveRes = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!saveRes.ok) {
                const err = await saveRes.json().catch(() => ({}));
                throw new Error(err.error || `Save failed (${saveRes.status})`);
            }

            alert("Schedule saved successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            alert(
                error instanceof Error
                    ? `Failed to save: ${error.message}`
                    : "Failed to save. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const addTimeSlot = (day: string) => {
        const updated = { ...schedule };
        const location = updated[selectedLocation as keyof Schedule];

        if (!location[day]) {
            location[day] = [];
        }

        location[day].push({ time: "", group: "" });
        setSchedule(updated);
    };

    const updateTimeSlot = (day: string, index: number, field: "time" | "group", value: string) => {
        const updated = { ...schedule };
        updated[selectedLocation as keyof Schedule][day][index][field] = value;
        setSchedule(updated);
    };

    const removeTimeSlot = (day: string, index: number) => {
        const updated = { ...schedule };
        updated[selectedLocation as keyof Schedule][day].splice(index, 1);

        if (updated[selectedLocation as keyof Schedule][day].length === 0) {
            delete updated[selectedLocation as keyof Schedule][day];
        }

        setSchedule(updated);
    };

    const currentSchedule = schedule[selectedLocation as keyof Schedule] || {};

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
                    <p className="text-gray-600 mt-1">Manage class times for each location</p>
                </div>
                <button
                    onClick={saveSchedule}
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Schedule"}
                </button>
            </div>

            {/* Location Tabs */}
            <div className="flex gap-2 mb-6">
                {LOCATIONS.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedLocation === loc.id
                                ? "bg-brand text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {loc.name}
                    </button>
                ))}
            </div>

            {/* Schedule Grid */}
            <div className="space-y-4">
                {DAYS.map((day) => {
                    const slots = currentSchedule[day] || [];

                    return (
                        <div key={day} className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">{day}</h3>
                                <button
                                    onClick={() => addTimeSlot(day)}
                                    className="flex items-center gap-1 text-sm text-brand hover:text-brand/80"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Time Slot
                                </button>
                            </div>

                            {slots.length > 0 ? (
                                <div className="space-y-2">
                                    {slots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="Time (e.g., 4:00 PM - 7:00 PM)"
                                                value={slot.time}
                                                onChange={(e) => updateTimeSlot(day, index, "time", e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Group (e.g., Beginners)"
                                                value={slot.group}
                                                onChange={(e) => updateTimeSlot(day, index, "group", e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                                            />
                                            <button
                                                onClick={() => removeTimeSlot(day, index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">No classes scheduled</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
