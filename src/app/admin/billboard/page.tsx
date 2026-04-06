"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

interface BillboardContent {
    title: string;
    description: string;
    flyerImage: string;
    registrationFile: string;
    registrationFileName: string;
}

const defaultContent: BillboardContent = {
    title: "Summer Camp 2026",
    description: "",
    flyerImage: "",
    registrationFile: "",
    registrationFileName: "Registration Form.pdf",
};

export default function AdminBillboardPage() {
    const [content, setContent] = useState<BillboardContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingFlyer, setUploadingFlyer] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);

    const flyerInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/admin/pages/billboard")
            .then((r) => r.json())
            .then((data) => {
                if (data.content && Object.keys(data.content).length > 0) {
                    setContent({ ...defaultContent, ...data.content });
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
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error("Save failed");
            alert("Billboard saved!");
        } catch {
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

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
            setContent((c) => ({ ...c, flyerImage: data.path }));
        } catch {
            alert("Failed to upload image.");
        } finally {
            setUploadingFlyer(false);
            if (flyerInputRef.current) flyerInputRef.current.value = "";
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
            setContent((c) => ({
                ...c,
                registrationFile: data.path,
                registrationFileName: file.name,
            }));
        } catch {
            alert("Failed to upload file.");
        } finally {
            setUploadingPdf(false);
            if (pdfInputRef.current) pdfInputRef.current.value = "";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Billboard / Events</h1>
                <p className="text-gray-500 mt-1">Manage your public events page — flyer, registration form, and text.</p>
            </div>

            {/* Text Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-800">Page Text</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={content.title}
                        onChange={(e) => setContent((c) => ({ ...c, title: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                        placeholder="e.g. Summer Camp 2026"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={content.description}
                        onChange={(e) => setContent((c) => ({ ...c, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm resize-none"
                        placeholder="A brief description shown under the title..."
                    />
                </div>
            </div>

            {/* Flyer Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Event Flyer</h2>
                <p className="text-sm text-gray-500">Upload a flyer image (JPG, PNG, etc.) to display on the events page.</p>

                {content.flyerImage ? (
                    <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ maxHeight: 400 }}>
                            <div className="relative w-full" style={{ aspectRatio: '8.5/11', maxHeight: 400 }}>
                                <Image
                                    src={content.flyerImage}
                                    alt="Flyer preview"
                                    fill
                                    className="object-contain"
                                    sizes="600px"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => flyerInputRef.current?.click()}
                                disabled={uploadingFlyer}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                Replace Image
                            </button>
                            <button
                                onClick={() => setContent((c) => ({ ...c, flyerImage: "" }))}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => flyerInputRef.current?.click()}
                        disabled={uploadingFlyer}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-brand hover:bg-brand/5 transition-colors disabled:opacity-50"
                    >
                        {uploadingFlyer ? (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand" />
                                <span className="text-sm">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm font-medium">Click to upload flyer image</span>
                                <span className="text-xs">JPG, PNG, WebP, etc.</span>
                            </div>
                        )}
                    </button>
                )}

                <input
                    ref={flyerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFlyerUpload}
                />
            </div>

            {/* Registration PDF */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Registration Form (PDF)</h2>
                <p className="text-sm text-gray-500">Upload a PDF that visitors can download to register.</p>

                {content.registrationFile ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <FileText className="w-8 h-8 text-brand flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{content.registrationFileName}</p>
                                <a
                                    href={content.registrationFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand hover:underline"
                                >
                                    Preview file →
                                </a>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => pdfInputRef.current?.click()}
                                disabled={uploadingPdf}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                Replace File
                            </button>
                            <button
                                onClick={() => setContent((c) => ({ ...c, registrationFile: "", registrationFileName: "" }))}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => pdfInputRef.current?.click()}
                        disabled={uploadingPdf}
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-brand hover:bg-brand/5 transition-colors disabled:opacity-50"
                    >
                        {uploadingPdf ? (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand" />
                                <span className="text-sm">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <FileText className="w-8 h-8" />
                                <span className="text-sm font-medium">Click to upload registration form</span>
                                <span className="text-xs">PDF, DOCX, etc.</span>
                            </div>
                        )}
                    </button>
                )}

                <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword"
                    className="hidden"
                    onChange={handlePdfUpload}
                />
            </div>

            {/* Save */}
            <div className="flex justify-end pb-8">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-brand text-white font-medium rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
