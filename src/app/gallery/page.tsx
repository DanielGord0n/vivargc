import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/features/GalleryGrid";
import { siteContent } from "@/content/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Photos and videos of our gymnasts in training and performance.",
};

export default function GalleryPage() {
    return (
        <Container className="py-24">
            <SectionHeading
                title="Gallery"
                subtitle="Moments of grace, strength, and joy captured in the studio and on stage."
                centered
            />

            <GalleryGrid items={siteContent.gallery} />

            <div className="mt-24 text-center">
                <p className="text-gray-500 mb-4">Want to see more daily updates?</p>
                <a
                    href={siteContent.brand.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand font-bold hover:underline"
                >
                    Follow us on Instagram @viva_rgc
                </a>
            </div>
        </Container>
    );
}
