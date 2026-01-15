import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScheduleGrid } from "@/components/features/ScheduleGrid";
import { Button } from "@/components/ui/Button";
import { getScheduleAsync } from "@/lib/content";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Class Schedule",
    description: "Weekly schedule for recreational and competitive rhythmic gymnastics classes.",
};

// Force dynamic rendering to fetch from Supabase on each request
export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
    // Get schedule from Supabase
    const schedule = await getScheduleAsync();

    return (
        <Container className="py-24">
            <SectionHeading
                title="Class Schedule"
                subtitle="View class times for all our programs across both locations."
                centered
            />

            <ScheduleGrid schedule={schedule} />

            <div className="mt-16 bg-brand/5 p-8 rounded-2xl text-center border border-brand/10">
                <h3 className="font-display text-2xl font-bold mb-4">Not sure which group is right for you?</h3>
                <p className="text-gray-600 mb-6">Contact us for a free assessment so we can place your child in the perfect level.</p>
                <Link href="/contact">
                    <Button variant="primary">Contact Us</Button>
                </Link>
            </div>
        </Container>
    );
}
