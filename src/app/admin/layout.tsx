"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, Image, Calendar, BookOpen, LogOut, Undo2, Lock, FileText, Info, Megaphone } from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Home Page", href: "/admin/home", icon: FileText },
    { label: "Events", href: "/admin/billboard", icon: Megaphone },
    { label: "About Page", href: "/admin/about", icon: Info },
    { label: "Coaches", href: "/admin/coaches", icon: Users },
    { label: "Gallery", href: "/admin/gallery", icon: Image },
    { label: "Schedule", href: "/admin/schedule", icon: Calendar },
    { label: "Programs", href: "/admin/programs", icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [hasBackup, setHasBackup] = useState(false);
    const [restoring, setRestoring] = useState(false);

    useEffect(() => {
        // Check backup status on mount
        checkBackupStatus();
    }, []);

    const checkBackupStatus = async () => {
        try {
            const res = await fetch("/api/admin/backup");
            const data = await res.json();
            setHasBackup(data.hasBackup);
        } catch (error) {
            console.error("Failed to check backup status:", error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
            
            if (res.ok) {
                setIsAuthenticated(true);
                setError("");
            } else {
                setError("Incorrect password");
            }
        } catch (error) {
            setError("Authentication failed");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleUndo = async () => {
        if (!hasBackup) {
            alert("No backup available to restore.");
            return;
        }

        if (!confirm("Are you sure you want to undo all changes since the last save? This will restore the previous version.")) {
            return;
        }

        setRestoring(true);
        try {
            const res = await fetch("/api/admin/backup", { method: "PUT" });
            if (res.ok) {
                alert("Changes undone! Refreshing page...");
                window.location.reload();
            } else {
                alert("Failed to undo changes.");
            }
        } catch (error) {
            console.error("Undo failed:", error);
            alert("Failed to undo changes.");
        } finally {
            setRestoring(false);
        }
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand/10 to-purple-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-brand" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Viva RGC Admin</h1>
                        <p className="text-gray-600 mt-1">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand mb-4"
                            autoFocus
                        />

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:bg-brand/90 transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:text-brand">
                            ← Back to website
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-brand">Viva RGC Admin</h1>
                    <p className="text-sm text-gray-500">Content Manager</p>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand/10 text-brand"
                                        : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 space-y-2 border-t border-gray-200">
                    {/* Logout / Back to Site */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
