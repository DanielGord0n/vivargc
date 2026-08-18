"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, GripVertical } from "lucide-react";

interface Program {
    id: string;
    title: string;
    slug: string;
    ages: string;
    description: string;
}

export default function ProgramsAdmin() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            setPrograms(data.programs || []);
        } catch (error) {
            console.error("Failed to fetch programs:", error);
        } finally {
            setLoading(false);
        }
    };

    const savePrograms = async (updatedPrograms: Program[]) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            data.programs = updatedPrograms;

            const saveRes = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!saveRes.ok) {
                const err = await saveRes.json().catch(() => ({}));
                throw new Error(err.error || `Save failed (${saveRes.status})`);
            }

            setPrograms(updatedPrograms);
            alert("Programs saved successfully!");
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

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this program?")) {
            const updated = programs.filter((p) => p.id !== id);
            savePrograms(updated);
        }
    };

    const handleEdit = (program: Program) => {
        setEditingProgram({ ...program });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProgram({
            id: `program-${Date.now()}`,
            title: "",
            slug: "",
            ages: "",
            description: "",
        });
        setIsModalOpen(true);
    };

    const handleSaveProgram = () => {
        if (!editingProgram) return;

        // Auto-generate slug if empty
        if (!editingProgram.slug) {
            editingProgram.slug = editingProgram.title.toLowerCase().replace(/\s+/g, '-');
        }

        const exists = programs.find((p) => p.id === editingProgram.id);
        let updated: Program[];

        if (exists) {
            updated = programs.map((p) => (p.id === editingProgram.id ? editingProgram : p));
        } else {
            updated = [...programs, editingProgram];
        }

        savePrograms(updated);
        setIsModalOpen(false);
        setEditingProgram(null);
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
                    <p className="text-gray-600 mt-1">Manage program offerings</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Program
                </button>
            </div>

            {/* Programs List */}
            <div className="space-y-4">
                {programs.map((program) => (
                    <div
                        key={program.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{program.title}</h3>
                            <p className="text-sm text-brand">{program.ages}</p>
                            <p className="text-sm text-gray-500 truncate mt-1">{program.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(program)}
                                className="px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(program.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingProgram && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingProgram.title ? "Edit Program" : "Add Program"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={editingProgram.title}
                                    onChange={(e) =>
                                        setEditingProgram({ ...editingProgram, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                    placeholder="e.g., Competitive Team"
                                />
                            </div>

                            {/* Ages */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ages
                                </label>
                                <input
                                    type="text"
                                    value={editingProgram.ages}
                                    onChange={(e) =>
                                        setEditingProgram({ ...editingProgram, ages: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                    placeholder="e.g., Ages 5-12"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editingProgram.description}
                                    onChange={(e) =>
                                        setEditingProgram({ ...editingProgram, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand"
                                    placeholder="Describe the program..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProgram}
                                disabled={saving}
                                className="flex items-center gap-2 bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? "Saving..." : "Save Program"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
