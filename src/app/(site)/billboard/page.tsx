import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Download, Calendar, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events",
    description: "Upcoming events and announcements from Viva RGC.",
};

export const dynamic = 'force-dynamic';

interface BillboardEvent {
    id: string;
    title: string;
    description: string;
    flyerImage: string;
    registrationFile: string;
    registrationFileName: string;
}

interface BillboardContent {
    events: BillboardEvent[];
}

async function getBillboardContent(): Promise<BillboardContent> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            const res = await fetch(
                `${supabaseUrl}/rest/v1/page_content?page_id=eq.billboard&select=content`,
                {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                    },
                    cache: 'no-store',
                }
            );

            if (res.ok) {
                const rows = await res.json();
                if (rows.length > 0 && rows[0].content) {
                    const raw = rows[0].content;
                    // Support legacy single-event format
                    if (Array.isArray(raw.events)) {
                        return { events: raw.events };
                    }
                    if (raw.title || raw.flyerImage) {
                        return {
                            events: [{
                                id: 'legacy',
                                title: raw.title || '',
                                description: raw.description || '',
                                flyerImage: raw.flyerImage || '',
                                registrationFile: raw.registrationFile || '',
                                registrationFileName: raw.registrationFileName || '',
                            }],
                        };
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching billboard content:', error);
    }

    return { events: [] };
}

export default async function BillboardPage() {
    const { events } = await getBillboardContent();

    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-blush/30 via-white to-brand/5 py-24 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-72 h-72 bg-brand/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blush/20 rounded-full blur-3xl" />
                </div>
                <Container className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        What&apos;s On
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Events &amp; Announcements
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Exciting opportunities, camps, and news from Viva RGC.
                    </p>
                </Container>
            </div>

            <Container className="py-16">
                {events.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-brand/40" />
                        </div>
                        <h3 className="font-display text-2xl text-gray-400 mb-2">No events posted yet</h3>
                        <p className="text-gray-400">Check back soon for upcoming events and announcements.</p>
                    </div>
                ) : events.length === 1 ? (
                    /* Single event — featured layout */
                    <div className="max-w-5xl mx-auto">
                        <SingleEventFeatured event={events[0]} />
                    </div>
                ) : (
                    /* Multiple events — grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
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
            </Container>
        </div>
    );
}

function SingleEventFeatured({ event }: { event: BillboardEvent }) {
    return (
        <div className="bg-white rounded-3xl border border-blush/30 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Flyer */}
                {event.flyerImage && (
                    <div className="relative bg-gray-50 flex items-center justify-center p-8 min-h-[480px]">
                        <div className="relative w-full max-w-xs mx-auto" style={{ aspectRatio: '8.5/11' }}>
                            <Image
                                src={event.flyerImage}
                                alt={event.title}
                                fill
                                className="object-contain drop-shadow-lg"
                                sizes="400px"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="flex flex-col justify-center p-10 lg:p-12">
                    <div className="inline-flex items-center gap-2 text-brand text-sm font-medium mb-4">
                        <Calendar className="w-4 h-4" />
                        Upcoming Event
                    </div>
                    <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">{event.title}</h2>
                    {event.description && (
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">{event.description}</p>
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

function EventCard({ event }: { event: BillboardEvent }) {
    return (
        <div className="bg-white rounded-2xl border border-blush/30 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
            {/* Flyer thumbnail */}
            {event.flyerImage && (
                <div className="bg-gray-50 flex items-center justify-center p-6 h-72">
                    <div className="relative w-full max-w-[180px] mx-auto h-full">
                        <Image
                            src={event.flyerImage}
                            alt={event.title}
                            fill
                            className="object-contain drop-shadow"
                            sizes="250px"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-brand text-xs font-medium mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Upcoming Event
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                {event.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{event.description}</p>
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
