import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoachCard } from "@/components/features/CoachCard";
import { getCoaches } from "@/lib/content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Coaches",
    description: "Meet our team of national-level coaches dedicated to your child's success.",
};

export default function CoachesPage() {
    // Get coaches from CMS
    const coaches = getCoaches();

    return (
        <Container className="py-24">
            <SectionHeading
                title="Meet Our Coaches"
                subtitle="Led by national-level experts passionate about developing the next generation of gymnasts."
                centered
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coaches.map((coach) => (
                    <CoachCard key={coach.id} coach={coach} />
                ))}
                {/* Placeholder for hiring or future coaches */}
                <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 min-h-[400px]">
                    <p className="font-display text-xl font-bold text-gray-400 mb-2">Join Our Team</p>
                    <p className="text-gray-500 text-sm">Are you a passionate coach? Contact us.</p>
                </div>
            </div>
        </Container>
    );
}
