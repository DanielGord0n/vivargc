import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/content/siteContent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { ProgramCard } from "@/components/features/ProgramCard";
import { ArrowRight, MapPin, CheckCircle, Star } from "lucide-react";
import { HomePageContent } from "@/lib/content";

// Force dynamic rendering to fetch from Supabase on each request
export const dynamic = 'force-dynamic';

// Default content from siteContent
const defaultHomeContent: HomePageContent = {
  hero: {
    headline: siteContent.hero.headline,
    subhead: siteContent.hero.subhead,
    primaryCta: siteContent.hero.primaryCta,
    secondaryCta: siteContent.hero.secondaryCta,
    heroImage: "/images/Viva4.png",
  },
  galleryPreview: ["/images/Viva1.png", "/images/Viva2.png", "/images/Viva3.png", "/images/Viva8.png"],
  locations: siteContent.locations.map(loc => ({
    id: loc.id,
    name: loc.name,
    address: loc.address,
  })),
  faqs: siteContent.faqs,
};

// Fetch home page content using internal API (works reliably)
async function getHomeContent(): Promise<HomePageContent> {
  try {
    // Use the internal API which is confirmed working
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
      'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/admin/pages/home`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.content && Object.keys(data.content).length > 0) {
        return {
          ...defaultHomeContent,
          ...data.content,
          hero: { ...defaultHomeContent.hero, ...(data.content.hero || {}) },
          galleryPreview: data.content.galleryPreview || defaultHomeContent.galleryPreview,
          locations: data.content.locations || defaultHomeContent.locations,
          faqs: data.content.faqs || defaultHomeContent.faqs,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching home content:', error);
  }

  return defaultHomeContent;
}

export default async function Home() {
  // Get dynamic content from API
  const content = await getHomeContent();

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-gradient-to-b from-white via-white to-blush/10">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-blush/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] bg-brand/5 rounded-full blur-3xl -z-10" />

        <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blush/30 shadow-sm text-brand-dark text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-brand text-brand" />
              Est. 2014
            </div>

            <div className="mb-8 relative w-64 md:w-80 h-auto aspect-[3/1]">
              <Image
                src="/VivaGymnastics.png"
                alt="Viva Rhythmic Gymnastics"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              {content.hero.headline}
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              {content.hero.subhead}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="shadow-xl shadow-brand/20">
                  {content.hero.primaryCta}
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline" size="lg">
                  {content.hero.secondaryCta}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-4 md:gap-8 border-t border-gray-100 pt-8">
              {["National Certified Coaches", "Beginner Friendly", "Performance Focused"].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CheckCircle className="w-4 h-4 text-brand" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto">
              {/* Decorative border offset */}
              <div className="absolute inset-0 border-2 border-brand/20 rounded-[2rem] transform translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-brand/5 rounded-[2rem] transform -translate-x-4 -translate-y-4" />

              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src={content.hero.heroImage}
                  alt="Rhythmic Gymnastics"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PROGRAMS PREVIEW */}
      <section className="py-24 bg-white relative">
        <Container>
          <SectionHeading
            title="Our Programs"
            subtitle="From first steps to podium finishes, we have a path for every gymnast."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteContent.programs.slice(0, 3).map((program) => (
              <ProgramCard key={program.title} program={program} />
            ))}
            {/* Simple link card for more */}
            <Link href="/programs" className="group">
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand/50 hover:bg-brand/5 transition-all text-center">
                <div className="h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-8 h-8 text-brand" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">View All Programs</h3>
                <p className="text-gray-500">Camps, Drop-ins, and more</p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* LOCATIONS PREVIEW */}
      <section className="py-24 bg-gray-50">
        <Container>
          <SectionHeading
            title="Our Locations"
            subtitle="Conveniently located in Scarborough and Bayview."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.locations.map((loc) => (
              <LuxuryCard key={loc.id} className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blush/20 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-2">{loc.name}</h3>
                  <p className="text-gray-600 mb-4">{loc.address}</p>
                  <Link href="/contact" className="text-brand font-medium hover:underline flex items-center gap-1">
                    View Map <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </Container>
      </section>

      {/* GALLERY TEASER */}
      <section className="py-24 bg-brand-dark text-white relative isolate">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Experience the Artistry</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Rhythmic gymnastics combines the grace of dance with the coordination of sport. See our athletes in action.
              </p>
              <Link href="/gallery">
                <Button variant="secondary" size="lg">Explore Gallery</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {content.galleryPreview.map((src, i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                  <Image
                    src={src}
                    alt="Gallery preview"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ TEASER */}
      <section className="py-24 bg-gray-50">
        <Container className="max-w-3xl">
          <SectionHeading title="Common Questions" centered />
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="text-brand font-medium hover:underline">
              Have more questions? Contact us
            </Link>
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-white border-t border-gray-100">
        <Container className="text-center">
          <h2 className="font-display text-4xl font-bold mb-6">Ready to start?</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Join the Viva RGC family today and discover the joy of rhythmic gymnastics.
          </p>
          <Link href="/registration">
            <Button size="lg" className="px-12">Book a Free Trial Class</Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}
