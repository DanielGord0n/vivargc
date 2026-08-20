import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgramCard } from "@/components/features/ProgramCard";
import { getProgramsAsync } from "@/lib/content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Programs",
    description: "Rhythmic gymnastics programs for all ages and skill levels.",
};

// Force dynamic rendering to fetch from Supabase on each request
export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
    // Get programs from Supabase
    const programs = await getProgramsAsync();

    return (
        <Container className="py-24">
            <SectionHeading
                title="Training Programs"
                subtitle="We offer a comprehensive range of programs designed to nurture potential at every stage."
                centered
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-24">
                {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>

            <SectionHeading title="Athlete Pathway" centered className="mb-16" />

            <div className="relative max-w-4xl mx-auto">
                {/* Simple timeline/pathway visualization */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-100 -translate-x-1/2 hidden md:block" />

                <div className="space-y-12">
                    {[
                        { title: "Recreational", desc: "Building fundamentals, coordination, and love for the sport.", age: "Ages 5+" },
                        { title: "Pre-Competitive", desc: "Advanced basics and introduction to routines.", age: "Selected by Coach" },
                        { title: "Interclub", desc: "First step into competition with focus on fun and performance.", age: "By Audition" },
                        { title: "Provincial / National", desc: "High-performance training for serious athletes.", age: "By Audition" }
                    ].map((step, i) => (
                        <div key={step.title} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 w-full md:w-auto text-center md:text-right">
                                <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                                    <h4 className="font-display text-xl font-bold text-brand">{step.title}</h4>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{step.age}</span>
                                    <p className="text-gray-600 mt-2 text-sm">{step.desc}</p>
                                </div>
                            </div>
                            <div className="relative z-10 h-4 w-4 rounded-full bg-brand ring-4 ring-white" />
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
