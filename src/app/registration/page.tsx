import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { siteContent } from "@/content/siteContent";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Registration",
    description: "Register for Viva RGC programs. Book a trial class or sign up for the season.",
};

export default function RegistrationPage() {
    const { googleFormUrl } = siteContent.registration;

    return (
        <Container className="py-24">
            <SectionHeading
                title="Registration"
                subtitle="Secure your spot in our upcoming season."
                centered
            />

            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { num: "01", text: "Contact Us" },
                        { num: "02", text: "Choose Program" },
                        { num: "03", text: "Book Trial" },
                        { num: "04", text: "Register" }
                    ].map((step) => (
                        <div key={step.num} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                            <span className="text-3xl font-display font-bold text-blush/50 mb-1">{step.num}</span>
                            <span className="font-bold text-gray-700">{step.text}</span>
                        </div>
                    ))}
                </div>

                {googleFormUrl ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[800px]">
                        <iframe
                            src={googleFormUrl}
                            width="100%"
                            height="800"
                            frameBorder="0"
                            marginHeight={0}
                            marginWidth={0}
                            className="w-full"
                        >
                            Loading…
                        </iframe>
                    </div>
                ) : (
                    <LuxuryCard className="text-center py-16 px-8 max-w-2xl mx-auto">
                        <h3 className="font-display text-3xl font-bold text-brand-dark mb-4">
                            Online Registration Opening Soon
                        </h3>
                        <p className="text-gray-600 text-lg mb-8">
                            We are currently accepting registrations via email or phone. Please contact us to book your trial class or register for a program.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg">Contact Us to Register</Button>
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-gray-500">
                            Already a member? <a href="#" className="text-brand hover:underline">Login to Parent Portal</a> (Coming Soon)
                        </p>
                    </LuxuryCard>
                )}
            </div>
        </Container>
    );
}
