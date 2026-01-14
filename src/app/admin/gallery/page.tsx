"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Save, Upload, X, Play } from "lucide-react";

interface GalleryItem {
    id: string;
    src: string;
    category: string;
    alt: string;
}

export default function GalleryAdmin() {
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            setGallery(data.gallery || []);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveGallery = async (updatedGallery: GalleryItem[]) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();
            data.gallery = updatedGallery;

            await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            setGallery(updatedGallery);
            alert("Gallery saved successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const updated = gallery.filter((item) => item.id !== id);
            saveGallery(updated);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const newItems: GalleryItem[] = [];

            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();

                if (data.path) {
                    const isVideo = file.type.startsWith("video/");
                    newItems.push({
                        id: `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        src: data.path,
                        category: isVideo ? "Video" : "Performance",
                        alt: file.name.replace(/\.[^/.]+$/, ""),
                    });
                }
            }

            const updated = [...newItems, ...gallery];
            await saveGallery(updated);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const isVideo = (src: string) => {
        return src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov");
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
                    <p className="text-gray-600 mt-1">
                        {gallery.length} items • Upload images and videos
                    </p>
                </div>
                <label className={`flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand/90 transition-colors cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                    <Upload className="w-5 h-5" />
                    {uploading ? "Uploading..." : "Upload Media"}
                    <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                    <div
                        key={item.id}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
                    >
                        {isVideo(item.src) ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <Play className="w-12 h-12 text-white" />
                            </div>
                        ) : (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                            />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                            {item.category}
                        </div>
                    </div>
                ))}
            </div>

            {gallery.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <Image
                        src="/images/placeholder.svg"
                        alt="No images"
                        width={100}
                        height={100}
                        className="mx-auto mb-4 opacity-50"
                    />
                    <p>No gallery items yet.</p>
                    <p className="text-sm">Upload some images or videos to get started.</p>
                </div>
            )}
        </div>
    );
}
