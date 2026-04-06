import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Download, Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events",
    description: "Upcoming events and announcements from Viva RGC.",
};

export const dynamic = 'force-dynamic';

interface BillboardContent {
    title: string;
    description: string;
    flyerImage: string;
    registrationFile: string;
    registrationFileName: string;
}

const defaultContent: BillboardContent = {
    title: "Upcoming Events",
    description: "Stay tuned for exciting events and announcements from Viva RGC.",
    flyerImage: "",
    registrationFile: "",
    registrationFileName: "Registration Form.pdf",
};

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
                    return { ...defaultContent, ...rows[0].content };
                }
            }
        }
    } catch (error) {
        console.error('Error fetching billboard content:', error);
    }

    return defaultContent;
}

export default async function BillboardPage() {
    const content = await getBillboardContent();
    const hasContent = content.flyerImage || content.registrationFile || (content.title !== defaultContent.title);

    return (
        <div className="bg-white">
            {/* Hero Header */}
            <div className="bg-blush/10 py-20">
                <Container>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Calendar className="w-8 h-8 text-brand" />
                    </div>
                    <SectionHeading
                        title={content.title}
                        subtitle={content.description}
                        centered
                    />
                </Container>
            </div>

            <Container className="py-16">
                {!hasContent ? (
                    /* Empty state */
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-brand/50" />
                        </div>
                        <h3 className="font-display text-2xl text-gray-400 mb-2">No events posted yet</h3>
                        <p className="text-gray-400">Check back soon for upcoming events and announcements.</p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        {/* Flyer Image */}
                        {content.flyerImage && (
                            <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-blush/20">
                                <div className="relative w-full" style={{ aspectRatio: '8.5/11' }}>
                                    <Image
                                        src={content.flyerImage}
                                        alt={content.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 768px"
                                        priority
                                    />
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        {content.registrationFile && (
                            <div className="text-center mb-12">
                                <a
                                    href={content.registrationFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={content.registrationFileName}
                                >
                                    <Button size="lg" variant="primary" className="gap-2 inline-flex items-center">
                                        <Download className="w-5 h-5" />
                                        Download {content.registrationFileName}
                                    </Button>
                                </a>
                                <p className="text-sm text-gray-500 mt-3">
                                    Complete and send by e-transfer to nathaly.vivier@gmail.com
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-8 bg-brand-dark rounded-3xl p-12 text-center text-white relative overflow-hidden max-w-3xl mx-auto">
                    <div className="relative z-10">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Have questions?</h2>
                        <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                            Our team is happy to help with registration, scheduling, or anything else you need.
                        </p>
                        <Link href="/contact">
                            <Button variant="secondary" size="lg">Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
