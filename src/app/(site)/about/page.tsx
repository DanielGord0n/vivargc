import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";
import { AboutPageContent } from "@/lib/content";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Viva RGC's mission, values, and our commitment to excellence in rhythmic gymnastics.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const defaultContent: AboutPageContent = {
    header: {
        title: "Our Story",
        subtitle: "Founded with a passion for rhythm, movement, and athlete development.",
    },
    story: {
        title: "A New Standard in Rhythmic Gymnastics",
        paragraph1: "Viva RGC was established to provide a nurturing yet competitive environment for gymnasts of all levels. We believe that rhythmic gymnastics is more than just a sport—it is an art form that builds character, discipline, and lifelong confidence.",
        paragraph2: "Our facility is designed to inspire, and our curriculum is crafted to ensure every athlete reaches their full potential, whether they are taking their first steps on the carpet or competing on the national stage.",
    },
    quote: "Excellence is not an act, but a habit.",
    values: [
        { title: "Artistry", description: "We emphasize expression, musicality, and grace in every movement." },
        { title: "Athleticism", description: "Building strong bodies and minds through rigorous, safe training." },
        { title: "Confidence", description: "Empowering athletes to believe in themselves both on and off the carpet." },
    ],
    cta: {
        title: "Join the Viva Family",
        description: "Experience the difference of a club that puts athletes first. Book a trial class today.",
        buttonText: "Get Started",
        buttonLink: "/registration",
    },
};

// Fetch about page content directly from Supabase
async function getAboutContent(): Promise<AboutPageContent> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            const res = await fetch(
                `${supabaseUrl}/rest/v1/page_content?page_id=eq.about&select=content`,
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
        console.error('Error fetching about content:', error);
    }

    return defaultContent;
}

export default async function AboutPage() {
    const content = await getAboutContent();

    // Normalize quote (can be string or object)
    const quoteText = typeof content.quote === 'string' ? content.quote : content.quote.text;

    // Normalize CTA
    const ctaButtonText = content.cta.buttonText || "Get Started";
    const ctaButtonLink = content.cta.buttonLink || "/registration";

    return (
        <div className="bg-white">
            <div className="bg-blush/10 py-20">
                <Container>
                    <SectionHeading
                        title={content.header.title}
                        subtitle={content.header.subtitle}
                        centered
                    />
                </Container>
            </div>

            <Container className="py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <h3 className="font-display text-3xl font-bold mb-6">{content.story.title || "A New Standard in Rhythmic Gymnastics"}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {content.story.paragraph1}
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {content.story.paragraph2}
                        </p>
                    </div>
                    <div className="relative h-[400px] bg-brand/5 rounded-2xl overflow-hidden shadow-xl border border-brand/10 p-8 flex items-center justify-center">
                        <p className="font-display text-4xl text-brand-dark italic text-center">
                            &ldquo;{quoteText}&rdquo;
                        </p>
                    </div>
                </div>

                <SectionHeading title="Our Values" centered />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {content.values.map((val) => (
                        <div key={val.title} className="bg-gray-50 p-8 rounded-2xl text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blush/30">
                            <div className="h-12 w-12 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm">
                                <CheckCircle className="w-6 h-6 text-brand" />
                            </div>
                            <h4 className="font-display text-2xl font-bold mb-4">{val.title}</h4>
                            <p className="text-gray-600">{val.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-brand-dark rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{content.cta.title}</h2>
                        <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                            {content.cta.description}
                        </p>
                        <Link href={ctaButtonLink}>
                            <Button variant="secondary" size="lg">{ctaButtonText}</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}
