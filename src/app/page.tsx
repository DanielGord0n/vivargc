"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteContent } from "@/content/siteContent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { ProgramCard } from "@/components/features/ProgramCard";
import { TestimonialCarousel } from "@/components/features/TestimonialCarousel";
import { ArrowRight, MapPin, CheckCircle, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-gradient-to-b from-white via-white to-blush/10">
        {/* Abstract Background Shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-blush/20 rounded-full blur-3xl -z-10"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-[-5%] w-[300px] h-[300px] bg-brand/5 rounded-full blur-3xl -z-10"
        />

        <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blush/30 shadow-sm text-brand-dark text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-brand text-brand" />
              {siteContent.hero.badgeText}
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              {siteContent.hero.headline}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              {siteContent.hero.subhead}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="shadow-xl shadow-brand/20">
                  {siteContent.hero.primaryCta}
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline" size="lg">
                  {siteContent.hero.secondaryCta}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap gap-4 md:gap-8 border-t border-gray-100 pt-8">
              {["National Certified Coaches", "Beginner Friendly", "Performance Focused"].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <CheckCircle className="w-4 h-4 text-brand" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto">
              {/* Decorative border offset */}
              <div className="absolute inset-0 border-2 border-brand/20 rounded-[2rem] transform translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-brand/5 rounded-[2rem] transform -translate-x-4 -translate-y-4" />

              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src="/placeholders/hero.svg"
                  alt="Rhythmic Gymnastics"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Join us today</p>
                      <p className="font-display text-lg font-bold text-brand-dark">Trial Classes Available</p>
                    </div>
                    <div className="h-10 w-10 bg-brand rounded-full flex items-center justify-center text-white">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
            {siteContent.locations.map((loc) => (
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

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white overflow-hidden">
        <Container>
          <SectionHeading title="What Parents Say" centered />
          <TestimonialCarousel testimonials={siteContent.testimonials} />
        </Container>
      </section>

      {/* GALLERY TEASER */}
      <section className="py-24 bg-brand-dark text-white relative isolate">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
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
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                  <Image
                    src={`/placeholders/gallery1.svg`}
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
            {siteContent.faqs.slice(0, 3).map((faq, i) => (
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
            <Button size="lg" className="px-12">Book a Trial Class</Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}
