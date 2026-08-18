"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Calendar, X, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export interface BillboardEvent {
    id: string;
    title: string;
    description: string;
    flyerImage: string;
    registrationFile: string;
    registrationFileName: string;
}

export function BillboardEvents({ events }: { events: BillboardEvent[] }) {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [lightboxAlt, setLightboxAlt] = useState("");

    useEffect(() => {
        if (!lightboxSrc) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxSrc(null); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxSrc]);

    const openLightbox = (src: string, alt: string) => {
        setLightboxSrc(src);
        setLightboxAlt(alt);
    };

    return (
        <>
            {events.length === 0 ? (
                <div className="text-center py-24">
                    <div className="w-20 h-20 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-brand/40" />
                    </div>
                    <h3 className="font-display text-2xl text-gray-400 mb-2">No events posted yet</h3>
                    <p className="text-gray-400">Check back soon for upcoming events and announcements.</p>
                </div>
            ) : events.length === 1 ? (
                <div className="max-w-5xl mx-auto">
                    <SingleEventFeatured event={events[0]} onOpenLightbox={openLightbox} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} onOpenLightbox={openLightbox} />
                    ))}
                </div>
            )}

            {/* CTA */}
            <div className="mt-20 bg-brand-dark rounded-3xl p-12 text-center text-white max-w-5xl mx-auto">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Have questions?</h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                    Our team is happy to help with registration, scheduling, or anything else you need.
                </p>
                <Link href="/contact">
                    <Button variant="secondary" size="lg">Contact Us</Button>
                </Link>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxSrc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setLightboxSrc(null)}
                    >
                        <button
                            onClick={() => setLightboxSrc(null)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-h-[90vh] max-w-3xl w-full"
                            style={{ aspectRatio: '8.5/11' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={lightboxSrc}
                                alt={lightboxAlt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 900px"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function SingleEventFeatured({
    event,
    onOpenLightbox,
}: {
    event: BillboardEvent;
    onOpenLightbox: (src: string, alt: string) => void;
}) {
    return (
        <div className="bg-white rounded-3xl border border-blush/30 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {event.flyerImage && (
                    <div
                        className="relative bg-gray-50 flex items-center justify-center p-8 min-h-[480px] cursor-zoom-in group"
                        onClick={() => onOpenLightbox(event.flyerImage, event.title)}
                    >
                        <div className="relative w-full max-w-xs mx-auto" style={{ aspectRatio: '8.5/11' }}>
                            <Image
                                src={event.flyerImage}
                                alt={event.title}
                                fill
                                className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                                sizes="400px"
                                priority
                            />
                        </div>
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-4 h-4 text-gray-600" />
                        </div>
                    </div>
                )}

                <div className="flex flex-col justify-center p-10 lg:p-12">
                    <div className="inline-flex items-center gap-2 text-brand text-sm font-medium mb-4">
                        <Calendar className="w-4 h-4" />
                        Upcoming Event
                    </div>
                    <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">{event.title}</h2>
                    {event.description && (
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line">{event.description}</p>
                    )}
                    {event.registrationFile && (
                        <div className="space-y-3">
                            <a
                                href={event.registrationFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={event.registrationFileName}
                            >
                                <Button size="lg" variant="primary" className="gap-2 inline-flex items-center w-full justify-center">
                                    <Download className="w-5 h-5" />
                                    Download Registration Form
                                </Button>
                            </a>
                            <p className="text-xs text-gray-400 text-center">
                                Send completed form by e-transfer to nathaly.vivier@gmail.com
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCard({
    event,
    onOpenLightbox,
}: {
    event: BillboardEvent;
    onOpenLightbox: (src: string, alt: string) => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-blush/30 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
            {event.flyerImage && (
                <div
                    className="bg-gray-50 flex items-center justify-center p-6 h-72 cursor-zoom-in group relative"
                    onClick={() => onOpenLightbox(event.flyerImage, event.title)}
                >
                    <div className="relative w-full max-w-[180px] mx-auto h-full">
                        <Image
                            src={event.flyerImage}
                            alt={event.title}
                            fill
                            className="object-contain drop-shadow transition-transform duration-300 group-hover:scale-[1.03]"
                            sizes="250px"
                        />
                    </div>
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4 text-gray-600" />
                    </div>
                </div>
            )}

            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-brand text-xs font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Upcoming Event
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-dark mb-3">{event.title}</h3>
                {event.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 whitespace-pre-line">{event.description}</p>
                )}
                {event.registrationFile && (
                    <a
                        href={event.registrationFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={event.registrationFileName}
                    >
                        <Button size="sm" variant="primary" className="gap-2 inline-flex items-center w-full justify-center">
                            <Download className="w-4 h-4" />
                            Download Form
                        </Button>
                    </a>
                )}
            </div>
        </div>
    );
}
