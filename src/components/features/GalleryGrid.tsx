"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { GalleryItem } from "@/content/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface GalleryGridProps {
    items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    // Keyboard Navigation
    useEffect(() => {
        if (!selectedItem) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedItem(null);
                return;
            }

            const currentIndex = items.findIndex(i => i.src === selectedItem.src);
            if (currentIndex === -1) return;

            if (e.key === "ArrowLeft") {
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                setSelectedItem(items[prevIndex]);
            } else if (e.key === "ArrowRight") {
                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                setSelectedItem(items[nextIndex]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedItem, items]);

    return (
        <div>
            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                <AnimatePresence>
                    {items.map((item, idx) => (
                        <motion.div
                            layout
                            key={item.src}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-square cursor-pointer group overflow-hidden rounded-xl"
                            onClick={() => setSelectedItem(item)}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            {item.category === 'Video' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Nav Buttons (Visual cues) */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 hidden md:block"
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = items.findIndex(i => i.src === selectedItem.src);
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                                setSelectedItem(items[prevIndex]);
                            }}
                        >
                            ‹
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-4 hidden md:block"
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = items.findIndex(i => i.src === selectedItem.src);
                                const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                                setSelectedItem(items[nextIndex]);
                            }}
                        >
                            ›
                        </button>

                        <div className="relative w-full max-w-4xl max-h-[85vh] aspect-video" onClick={(e) => e.stopPropagation()}>
                            {/* Simplified lightbox - just re-render image or placeholder video */}
                            {selectedItem.category === 'Video' ? (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                                    <p>Video Placeholder (Embed YouTube Here)</p>
                                </div>
                            ) : (
                                <Image
                                    src={selectedItem.src}
                                    alt={selectedItem.alt}
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                        <p className="absolute bottom-8 text-white/80 font-medium">{selectedItem.alt}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
