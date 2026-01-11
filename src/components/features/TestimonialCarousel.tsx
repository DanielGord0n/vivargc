"use client";

import { useState, useEffect } from "react";
import { Testimonial } from "@/content/types";
import { motion, AnimatePresence } from "framer-motion";
import { TextQuote, ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="relative max-w-4xl mx-auto px-12 py-12">
            <TextQuote className="absolute top-0 left-4 text-brand/10 w-24 h-24 -z-10" />

            <div className="relative h-64 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <p className="font-display text-2xl md:text-3xl text-gray-800 italic leading-relaxed mb-8">
                            &quot;{testimonials[index].text}&quot;
                        </p>
                        <div>
                            <h4 className="font-sans font-bold text-brand uppercase tracking-wider text-sm">
                                {testimonials[index].author}
                            </h4>
                            <span className="text-gray-400 text-xs">
                                {testimonials[index].role}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${index === i ? "bg-brand w-6" : "bg-gray-200"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
