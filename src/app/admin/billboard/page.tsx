"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X, FileText, Image as ImageIcon, Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface BillboardEvent {
    id: string;
    title: string;
    description: string;
    flyerImage: string;
    registrationFile: string;
    registrationFileName: string;
}

function newEvent(): BillboardEvent {
    return {
        id: `event_${Date.now()}`,
        title: "",
        description: "",
        flyerImage: "",
        registrationFile: "",
        registrationFileName: "",
    };
}

export default function AdminBillboardPage() {
    const [events, setEvents] = useState<BillboardEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/pages/billboard")
            .then((r) => r.json())
            .then((data) => {
                const raw = data.content || {};
                if (Array.isArray(raw.events) && raw.events.length > 0) {
                    setEvents(raw.events);
                    setExpanded(raw.events[0].id);
                } else if (raw.title || raw.flyerImage) {
                    // Migrate legacy single-event format
                    const migrated: BillboardEvent = {
                        id: `event_${Date.now()}`,
                        title: raw.title || "",
                        description: raw.description || "",
                        flyerImage: raw.flyerImage || "",
                        registrationFile: raw.registrationFile || "",
                        registrationFileName: raw.registrationFileName || "",
                    };
                    setEvents([migrated]);
                    setExpanded(migrated.id);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/pages/billboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: { events } }),
            });
            if (!res.ok) throw new Error("Save failed");
            alert("Billboard saved!");
        } catch {
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const addEvent = () => {
        const e = newEvent();
        setEvents((prev) => [...prev, e]);
        setExpanded(e.id);
    };

    const removeEvent = (id: string) => {
        if (!confirm("Remove this event?")) return;
        setEvents((prev) => prev.filter((e) => e.id !== id));
        if (expanded === id) setExpanded(null);
    };

    const updateEvent = (id: string, patch: Partial<BillboardEvent>) => {
        setEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...patch } : e));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Billboard / Events</h1>
                    <p className="text-gray-500 mt-1 text-sm">Add, edit, or remove events shown on the public Events page.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-brand text-white font-medium rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 text-sm"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {events.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-sm mb-4">No events yet. Add one below.</p>
                </div>
            )}

            {events.map((event, idx) => (
                <EventEditor
                    key={event.id}
                    event={event}
                    index={idx}
                    isExpanded={expanded === event.id}
                    onToggle={() => setExpanded(expanded === event.id ? null : event.id)}
                    onChange={(patch) => updateEvent(event.id, patch)}
                    onRemove={() => removeEvent(event.id)}
                />
            ))}

            <button
                onClick={addEvent}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors text-sm font-medium"
            >
                <Plus className="w-4 h-4" />
                Add Event
            </button>

            {events.length > 0 && (
                <div className="flex justify-end pb-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-brand text-white font-medium rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            )}
        </div>
    );
}

function EventEditor({
    event,
    index,
    isExpanded,
    onToggle,
    onChange,
    onRemove,
}: {
    event: BillboardEvent;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
    onChange: (patch: Partial<BillboardEvent>) => void;
    onRemove: () => void;
}) {
    const [uploadingFlyer, setUploadingFlyer] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const flyerRef = useRef<HTMLInputElement>(null);
    const pdfRef = useRef<HTMLInputElement>(null);

    const handleFlyerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingFlyer(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            onChange({ flyerImage: data.path });
        } catch {
            alert("Failed to upload image.");
        } finally {
            setUploadingFlyer(false);
            if (flyerRef.current) flyerRef.current.value = "";
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingPdf(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            onChange({ registrationFile: data.path, registrationFileName: file.name });
        } catch {
            alert("Failed to upload file.");
        } finally {
            setUploadingPdf(false);
            if (pdfRef.current) pdfRef.current.value = "";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Header / toggle */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                    </span>
                    <span className="font-medium text-gray-800 truncate">
                        {event.title || "Untitled Event"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
            </button>

            {isExpanded && (
                <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            value={event.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                            placeholder="e.g. Summer Camp 2026"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={event.description}
                            onChange={(e) => onChange({ description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm resize-none"
                            placeholder="Brief description of the event..."
                        />
                    </div>

                    {/* Flyer Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Flyer</label>
                        {event.flyerImage ? (
                            <div className="space-y-2">
                                <div className="relative bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-4" style={{ height: 220 }}>
                                    <div className="relative h-full" style={{ aspectRatio: '8.5/11' }}>
                                        <Image src={event.flyerImage} alt="Flyer" fill className="object-contain" sizes="300px" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => flyerRef.current?.click()}
                                        disabled={uploadingFlyer}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50"
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Replace
                                    </button>
                                    <button
                                        onClick={() => onChange({ flyerImage: "" })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => flyerRef.current?.click()}
                                disabled={uploadingFlyer}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand hover:bg-brand/5 transition-colors disabled:opacity-50"
                            >
                                {uploadingFlyer ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand" />
                                        <span className="text-xs">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                        <ImageIcon className="w-7 h-7" />
                                        <span className="text-sm font-medium">Upload flyer image</span>
                                        <span className="text-xs">JPG, PNG, WebP</span>
                                    </div>
                                )}
                            </button>
                        )}
                        <input ref={flyerRef} type="file" accept="image/*" className="hidden" onChange={handleFlyerUpload} />
                    </div>

                    {/* Registration PDF */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Form (PDF)</label>
                        {event.registrationFile ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                    <FileText className="w-7 h-7 text-brand flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{event.registrationFileName}</p>
                                        <a href={event.registrationFile} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline">
                                            Preview →
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => pdfRef.current?.click()}
                                        disabled={uploadingPdf}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50"
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Replace
                                    </button>
                                    <button
                                        onClick={() => onChange({ registrationFile: "", registrationFileName: "" })}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => pdfRef.current?.click()}
                                disabled={uploadingPdf}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand hover:bg-brand/5 transition-colors disabled:opacity-50"
                            >
                                {uploadingPdf ? (
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand" />
                                        <span className="text-xs">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                        <FileText className="w-7 h-7" />
                                        <span className="text-sm font-medium">Upload registration form</span>
                                        <span className="text-xs">PDF, DOCX</span>
                                    </div>
                                )}
                            </button>
                        )}
                        <input ref={pdfRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword" className="hidden" onChange={handlePdfUpload} />
                    </div>
                </div>
            )}
        </div>
    );
}
