import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/features/GalleryGrid";
import { getGallery } from "@/lib/content";
import { siteContent } from "@/content/siteContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Photos and videos of our gymnasts in training and performance.",
};

export default function GalleryPage() {
    // Get gallery items from CMS
    const cmsGallery = getGallery();

    // Map to the format expected by GalleryGrid
    const items = cmsGallery.map(item => ({
        src: item.src,
        category: item.category as "Performance" | "Training" | "Video",
        alt: item.alt,
    }));

    return (
        <Container className="py-24">
            <SectionHeading
                title="Gallery"
                subtitle="Moments of grace, strength, and joy captured in the studio and on stage."
                centered
            />

            <GalleryGrid items={items} />

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
