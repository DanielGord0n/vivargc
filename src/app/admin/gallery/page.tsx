"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, X, Play, Expand, ChevronLeft, ChevronRight } from "lucide-react";

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
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

    const createBackup = async () => {
        try {
            await fetch("/api/admin/backup", { method: "POST" });
        } catch (error) {
            console.error("Failed to create backup:", error);
        }
    };

    const saveGallery = async (updatedGallery: GalleryItem[]) => {
        setSaving(true);
        try {
            await createBackup();

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

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextItem = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % gallery.length);
        }
    };

    const prevItem = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
        }
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
                        {gallery.length} items • Click to preview, hover to delete
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
                {gallery.map((item, index) => (
                    <div
                        key={item.id}
                        className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        {isVideo(item.src) ? (
                            <video
                                src={item.src}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                            />
                        ) : (
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                            />
                        )}

                        {/* Video indicator */}
                        {isVideo(item.src) && (
                            <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
                                <Play className="w-4 h-4 text-white" />
                            </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openLightbox(index);
                                }}
                                className="p-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Expand className="w-5 h-5" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                }}
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
                    <p>No gallery items yet.</p>
                    <p className="text-sm">Upload some images or videos to get started.</p>
                </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && gallery[lightboxIndex] && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation */}
                    <button
                        onClick={prevItem}
                        className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={nextItem}
                        className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Media */}
                    <div className="max-w-5xl max-h-[80vh] w-full mx-4">
                        {isVideo(gallery[lightboxIndex].src) ? (
                            <video
                                src={gallery[lightboxIndex].src}
                                controls
                                autoPlay
                                className="w-full h-full max-h-[80vh] object-contain"
                            />
                        ) : (
                            <Image
                                src={gallery[lightboxIndex].src}
                                alt={gallery[lightboxIndex].alt}
                                width={1200}
                                height={800}
                                className="w-full h-full max-h-[80vh] object-contain"
                            />
                        )}
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                        {lightboxIndex + 1} / {gallery.length}
                    </div>
                </div>
            )}
        </div>
    );
}
