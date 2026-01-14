"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Save, Upload, X, GripVertical } from "lucide-react";

interface Coach {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    images: string[];
    credentials: string[];
    specialties: string[];
}

export default function CoachesAdmin() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            setCoaches(data.coaches || []);
        } catch (error) {
            console.error("Failed to fetch coaches:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveCoaches = async (updatedCoaches: Coach[]) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            data.coaches = updatedCoaches;

            await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            setCoaches(updatedCoaches);
            alert("Coaches saved successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this coach?")) {
            const updated = coaches.filter((c) => c.id !== id);
            saveCoaches(updated);
        }
    };

    const handleEdit = (coach: Coach) => {
        setEditingCoach({ ...coach });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingCoach({
            id: `coach-${Date.now()}`,
            name: "",
            role: "",
            bio: "",
            image: "",
            images: [],
            credentials: [],
            specialties: [],
        });
        setIsModalOpen(true);
    };

    const handleSaveCoach = () => {
        if (!editingCoach) return;

        const exists = coaches.find((c) => c.id === editingCoach.id);
        let updated: Coach[];

        if (exists) {
            updated = coaches.map((c) => (c.id === editingCoach.id ? editingCoach : c));
        } else {
            updated = [...coaches, editingCoach];
        }

        saveCoaches(updated);
        setIsModalOpen(false);
        setEditingCoach(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingCoach) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.path) {
                setEditingCoach({
                    ...editingCoach,
                    image: data.path,
                    images: [...editingCoach.images, data.path],
                });
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image");
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Coaches</h1>
                    <p className="text-gray-600 mt-1">Manage coach profiles</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Coach
                </button>
            </div>

            {/* Coach List */}
            <div className="space-y-4">
                {coaches.map((coach) => (
                    <div
                        key={coach.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                    >
                        <div className="flex-shrink-0">
                            {coach.image ? (
                                <Image
                                    src={coach.image}
                                    alt={coach.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-2xl">?</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                            <p className="text-sm text-brand">{coach.role}</p>
                            <p className="text-sm text-gray-500 truncate mt-1">{coach.bio}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(coach)}
                                className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(coach.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingCoach && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-bold">
                                {editingCoach.name ? "Edit Coach" : "Add Coach"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image
                                </label>
                                <div className="flex items-center gap-4">
                                    {editingCoach.image ? (
                                        <Image
                                            src={editingCoach.image}
                                            alt="Preview"
                                            width={100}
                                            height={100}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editingCoach.name}
                                    onChange={(e) =>
                                        setEditingCoach({ ...editingCoach, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={editingCoach.role}
                                    onChange={(e) =>
                                        setEditingCoach({ ...editingCoach, role: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={editingCoach.bio}
                                    onChange={(e) =>
                                        setEditingCoach({ ...editingCoach, bio: e.target.value })
                                    }
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                />
                            </div>

                            {/* Credentials */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Credentials (one per line)
                                </label>
                                <textarea
                                    value={editingCoach.credentials.join("\n")}
                                    onChange={(e) =>
                                        setEditingCoach({
                                            ...editingCoach,
                                            credentials: e.target.value.split("\n").filter(Boolean),
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                />
                            </div>

                            {/* Specialties */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialties (one per line)
                                </label>
                                <textarea
                                    value={editingCoach.specialties.join("\n")}
                                    onChange={(e) =>
                                        setEditingCoach({
                                            ...editingCoach,
                                            specialties: e.target.value.split("\n").filter(Boolean),
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCoach}
                                disabled={saving}
                                className="flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? "Saving..." : "Save Coach"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
