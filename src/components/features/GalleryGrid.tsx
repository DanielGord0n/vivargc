"use client";

import { useState } from "react";
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
    const [filter, setFilter] = useState<string>("All");
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];
    const filteredItems = filter === "All" ? items : items.filter(i => i.category === filter);

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrapjustify-center gap-3 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            filter === cat
                                ? "bg-brand text-white shadow-md"
                                : "bg-white text-gray-500 hover:text-brand hover:bg-gray-50 border border-gray-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                <AnimatePresence>
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            layout
                            key={idx} // Using idx as key for simplicity in this demo, better to use unique ID
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
                        <div className="relative w-full max-w-4xl max-h-[85vh] aspect-video">
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
