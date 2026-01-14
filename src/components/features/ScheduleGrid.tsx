"use client";

import { useState } from "react";
import { Schedule, ScheduleItem } from "@/lib/content";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScheduleGridProps {
    schedule: Schedule;
}

type LocationKey = "scarborough" | "bayview";

export function ScheduleGrid({ schedule }: ScheduleGridProps) {
    const locations: LocationKey[] = ["scarborough", "bayview"];
    const locationNames: Record<LocationKey, string> = {
        scarborough: "Scarborough",
        bayview: "North York (Bayview)",
    };
    const [activeLocation, setActiveLocation] = useState<LocationKey>(locations[0]);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-10 gap-4">
                {locations.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={cn(
                            "px-8 py-3 rounded-full text-sm font-medium transition-all duration-300",
                            activeLocation === loc
                                ? "bg-brand text-white shadow-lg shadow-brand/20 scale-105"
                                : "bg-white text-gray-500 hover:text-brand hover:bg-gray-50 border border-gray-200"
                        )}
                    >
                        {locationNames[loc]}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeLocation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-gray-100"
                    >
                        {days.map((day) => {
                            const classes: ScheduleItem[] | undefined = schedule[activeLocation]?.[day];
                            return (
                                <div key={day} className="p-6 md:p-8 min-h-[200px] border-b border-gray-100 last:border-0 md:border-b-0">
                                    <h4 className="font-display text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-blush/20 inline-block">
                                        {day}
                                    </h4>

                                    {classes && classes.length > 0 ? (
                                        <ul className="space-y-4">
                                            {classes.map((cls: ScheduleItem, idx: number) => (
                                                <li key={idx} className="group">
                                                    <div className="text-sm font-bold text-brand group-hover:text-brand-dark transition-colors">
                                                        {cls.time}
                                                    </div>
                                                    <div className="text-gray-600 font-medium text-sm">
                                                        {cls.group}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No classes scheduled</p>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 italic">
                * Schedule is subject to change. Private lessons available upon request.
            </div>
        </div>
    );
}
