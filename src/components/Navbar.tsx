"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteContent } from "@/content/siteContent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled || isOpen
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-blush/20 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <Container className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative z-50 flex items-center gap-2 group">
                    {/* Using SVG placeholder for logo */}
                    <div className="relative h-10 w-32 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/logo.svg"
                            alt={siteContent.brand.name}
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {siteContent.nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-brand",
                                pathname === item.href ? "text-brand font-semibold" : "text-gray-600"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/contact">
                        <Button size="sm" variant="primary">
                            {siteContent.hero.primaryCta}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden relative z-50 p-2 text-gray-600 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </Container>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-0 w-full bg-white shadow-xl border-b border-blush/30 pt-24 pb-8 md:hidden"
                    >
                        <Container className="flex flex-col gap-4">
                            {siteContent.nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-lg font-medium py-2 border-b border-gray-100",
                                        pathname === item.href ? "text-brand" : "text-gray-700"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <Link href="/contact" className="w-full">
                                    <Button className="w-fulljustify-center">
                                        {siteContent.hero.primaryCta}
                                    </Button>
                                </Link>
                            </div>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
