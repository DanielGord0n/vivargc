"use client";

import Link from "next/link";
import { Users, Image, Calendar, BookOpen, ArrowRight, Home, Info, Megaphone } from "lucide-react";

const sections = [
    {
        title: "Home Page",
        description: "Edit hero, locations, and FAQs",
        href: "/admin/home",
        icon: Home,
        color: "bg-brand",
    },
    {
        title: "Events",
        description: "Add, edit, or remove events and flyers",
        href: "/admin/billboard",
        icon: Megaphone,
        color: "bg-rose-500",
    },
    {
        title: "About Page",
        description: "Edit story, values, and CTA",
        href: "/admin/about",
        icon: Info,
        color: "bg-pink-500",
    },
    {
        title: "Coaches",
        description: "Add, edit, or remove coach profiles",
        href: "/admin/coaches",
        icon: Users,
        color: "bg-purple-500",
    },
    {
        title: "Gallery",
        description: "Manage photos and videos",
        href: "/admin/gallery",
        icon: Image,
        color: "bg-blue-500",
    },
    {
        title: "Schedule",
        description: "Update class times and groups",
        href: "/admin/schedule",
        icon: Calendar,
        color: "bg-green-500",
    },
    {
        title: "Programs",
        description: "Edit program descriptions",
        href: "/admin/programs",
        icon: BookOpen,
        color: "bg-orange-500",
    },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome to the Viva RGC content manager. Select a section to edit.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-brand/30 transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`${section.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mt-4">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 mt-1">{section.description}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-brand/5 rounded-xl border border-brand/10">
                <h3 className="font-semibold text-gray-900">Quick Tips</h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• Changes are saved automatically when you click &quot;Save&quot;</li>
                    <li>• Upload images directly by clicking the upload button</li>
                    <li>• Preview changes on the live site after saving</li>
                </ul>
            </div>
        </div>
    );
}
