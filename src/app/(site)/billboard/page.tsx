import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BillboardEvents, BillboardEvent } from "@/components/features/BillboardEvents";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events",
    description: "Upcoming events and announcements from Viva RGC.",
};

export const dynamic = 'force-dynamic';

async function getBillboardContent(): Promise<BillboardEvent[]> {
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
                    if (Array.isArray(raw.events)) return raw.events;
                    // Legacy single-event format
                    if (raw.title || raw.flyerImage) {
                        return [{
                            id: 'legacy',
                            title: raw.title || '',
                            description: raw.description || '',
                            flyerImage: raw.flyerImage || '',
                            registrationFile: raw.registrationFile || '',
                            registrationFileName: raw.registrationFileName || '',
                        }];
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching billboard content:', error);
    }
    return [];
}

export default async function BillboardPage() {
    const events = await getBillboardContent();

    return (
        <div className="bg-white">
            <div className="bg-blush/10 py-20">
                <Container>
                    <SectionHeading
                        title="Events & Announcements"
                        subtitle="Exciting opportunities, camps, and news from Viva RGC."
                        centered
                    />
                </Container>
            </div>

            <Container className="py-16">
                <BillboardEvents events={events} />
            </Container>
        </div>
    );
}
