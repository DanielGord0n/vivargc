import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/features/ContactForm";
import { siteContent } from "@/content/siteContent";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with Viva RGC. Visit us in Scarborough or Bayview.",
};

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-dark overflow-hidden py-24 lg:py-32">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blush opacity-10 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 text-center">
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        {siteContent.contact.title}
                    </h1>
                    <p className="text-white/90 max-w-2xl mx-auto text-xl leading-relaxed font-light">
                        We&apos;d love to hear from you. Contact us for trial classes, assessments, and general inquiries.
                    </p>
                </Container>
            </div>

            <Container className="py-24 -mt-12">

                {/* Contact Form Section */}
                <div className="max-w-3xl mx-auto mb-24">
                    <ContactForm />

                    {/* Quick Contact Grid */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-sm text-brand">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                            <a href={`tel:${siteContent.brand.socials.phone}`} className="text-gray-600 hover:text-brand transition-colors block">{siteContent.brand.socials.phone}</a>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-sm text-brand">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                            <a href={`mailto:${siteContent.brand.socials.email}`} className="text-gray-600 hover:text-brand transition-colors block text-sm">{siteContent.brand.socials.email}</a>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100">
                            <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-sm text-brand">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Hours</h4>
                            <p className="text-gray-600 text-sm">Mon - Sat: 9am - 8pm</p>
                        </div>
                    </div>
                </div>

                {/* Locations Section */}
                <div className="mb-24">
                    <SectionHeading title="Our Locations" centered />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {siteContent.locations.map((loc) => (
                            <div key={loc.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="bg-blush/20 p-2 rounded-full shrink-0">
                                        <MapPin className="w-5 h-5 text-brand" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl mb-1">{loc.name}</h4>
                                        <p className="text-gray-600 mb-2 leading-relaxed">{loc.address}</p>
                                        <a href={loc.mapUrl} target="_blank" className="text-sm text-brand font-bold hover:underline inline-flex items-center gap-1">
                                            Open in Maps &rarr;
                                        </a>
                                    </div>
                                </div>
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 mt-auto shadow-inner">
                                    <iframe
                                        src={loc.mapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <SectionHeading title="Frequently Asked Questions" centered />
                    <div className="space-y-4">
                        {siteContent.faqs.map((faq, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-lg mb-2 text-brand-dark">{faq.question}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
