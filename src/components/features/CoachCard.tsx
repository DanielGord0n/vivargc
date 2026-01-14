"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Coach } from "@/content/types";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CoachCardProps {
    coach: Coach;
}

export function CoachCard({ coach }: CoachCardProps) {
    const images = coach.images && coach.images.length > 0 ? coach.images : [coach.image];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Card Carousel Logic
    useEffect(() => {
        if (images.length <= 1) return;
        // Don't auto-scroll if modal is open to avoid confusion or performance
        if (isModalOpen) return;
        if (isHovered) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length, isHovered, isModalOpen]);

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    return (
        <>
            <LuxuryCard
                className="overflow-hidden p-0 border-0 group h-full flex flex-col cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative h-96 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {images.length > 0 ? (
                        images.map((img, idx) => (
                            <div
                                key={img}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`${coach.name} - Photo ${idx + 1}`}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-6xl">?</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10 w-full">
                        <h3 className="font-display text-2xl font-bold mb-1">{coach.name}</h3>
                        <p className="text-blush font-medium text-sm uppercase tracking-wide mb-2">{coach.role}</p>

                        {images.length > 1 && (
                            <div className="flex gap-1.5 mt-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCurrentIndex(idx);
                                        }}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-blush' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-20"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                <div className="p-6 flex-grow flex flex-col w-full">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-4 flex-grow">
                        {coach.bio}
                    </p>
                    <div className="mt-auto">
                        <span className="text-brand text-xs font-bold uppercase tracking-wider mb-2 block">Read full bio &rarr;</span>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coach.specialties.slice(0, 3).map((spec) => (
                                <span key={spec} className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-md border border-gray-100">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </LuxuryCard>

            {/* Modal Overlay */}
            {mounted && isModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                    <div
                        className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-black/10 text-gray-800 p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Modal Image Carousel (Left/Top) */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-50 flex-shrink-0 min-h-[300px]">
                            <div className="absolute inset-0">
                                <Image
                                    src={images[currentIndex]}
                                    alt={coach.name}
                                    fill
                                    className="object-contain object-center"
                                />
                            </div>

                            {/* Modal Carousel Controls */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                                className={`h-2 rounded-full transition-all shadow-sm ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Content (Right/Bottom) */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col max-h-[50vh] md:max-h-[90vh]">
                            <div>
                                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">{coach.name}</h2>
                                <p className="text-brand text-lg font-medium uppercase tracking-wide mb-8">{coach.role}</p>

                                <div className="prose prose-gray max-w-none mb-8">
                                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                        {coach.bio}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Credentials</h4>
                                        <ul className="space-y-2">
                                            {coach.credentials.map((cred) => (
                                                <li key={cred} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                                                    {cred}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Specialties</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {coach.specialties.map((spec) => (
                                                <span key={spec} className="bg-brand/5 text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-full border border-brand/10">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
