"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Save, Upload, X } from "lucide-react";

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

    const createBackup = async () => {
        try {
            await fetch("/api/admin/backup", { method: "POST" });
        } catch (error) {
            console.error("Failed to create backup:", error);
        }
    };

    const saveCoaches = async (updatedCoaches: Coach[]) => {
        setSaving(true);
        try {
            // Create backup before saving
            await createBackup();

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
        setEditingCoach({ ...coach, images: [...coach.images] });
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

        // Set primary image to first in images array if not set
        if (!editingCoach.image && editingCoach.images.length > 0) {
            editingCoach.image = editingCoach.images[0];
        }

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
        const files = e.target.files;
        if (!files || files.length === 0 || !editingCoach) return;

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();

                if (data.path) {
                    setEditingCoach(prev => {
                        if (!prev) return prev;
                        const newImages = [...prev.images, data.path];
                        return {
                            ...prev,
                            images: newImages,
                            image: prev.image || data.path, // Set primary if not set
                        };
                    });
                }
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Failed to upload image");
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        if (!editingCoach) return;

        const newImages = editingCoach.images.filter((_, i) => i !== index);
        const newPrimary = newImages.length > 0 ? newImages[0] : "";

        setEditingCoach({
            ...editingCoach,
            images: newImages,
            image: editingCoach.image === editingCoach.images[index] ? newPrimary : editingCoach.image,
        });
    };

    const handleSetPrimary = (imagePath: string) => {
        if (!editingCoach) return;
        setEditingCoach({ ...editingCoach, image: imagePath });
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
                        {/* Image Thumbnails */}
                        <div className="flex-shrink-0 flex gap-1">
                            {coach.images.slice(0, 3).map((img, i) => (
                                <Image
                                    key={i}
                                    src={img}
                                    alt={coach.name}
                                    width={60}
                                    height={60}
                                    className={`w-14 h-14 rounded-lg object-cover ${i === 0 ? 'ring-2 ring-brand' : 'opacity-70'}`}
                                />
                            ))}
                            {coach.images.length > 3 && (
                                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                                    +{coach.images.length - 3}
                                </div>
                            )}
                            {coach.images.length === 0 && (
                                <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xl">?</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                            <p className="text-sm text-brand">{coach.role}</p>
                            <p className="text-xs text-gray-400 mt-1">{coach.images.length} image(s)</p>
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
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
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

                        <div className="p-6 space-y-6">
                            {/* Images Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photos ({editingCoach.images.length})
                                </label>
                                <div className="grid grid-cols-4 gap-3 mb-3">
                                    {editingCoach.images.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <Image
                                                src={img}
                                                alt={`Photo ${i + 1}`}
                                                width={120}
                                                height={120}
                                                className={`w-full aspect-square rounded-lg object-cover ${img === editingCoach.image
                                                        ? 'ring-3 ring-brand'
                                                        : 'ring-1 ring-gray-200'
                                                    }`}
                                            />
                                            {/* Primary badge */}
                                            {img === editingCoach.image && (
                                                <div className="absolute top-1 left-1 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded">
                                                    Primary
                                                </div>
                                            )}
                                            {/* Hover controls */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                                {img !== editingCoach.image && (
                                                    <button
                                                        onClick={() => handleSetPrimary(img)}
                                                        className="px-2 py-1 bg-white text-xs rounded hover:bg-gray-100"
                                                    >
                                                        Set Primary
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Upload button */}
                                    <label className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-brand flex flex-col items-center justify-center cursor-pointer transition-colors">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                        <span className="text-xs text-gray-400 mt-1">Add Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Click primary image to change. Hover to set primary or delete.
                                </p>
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
