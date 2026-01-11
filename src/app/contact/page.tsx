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
        <div className="bg-gray-50/50 min-h-screen">
            <div className="bg-brand text-white py-20">
                <Container>
                    <SectionHeading
                        title={siteContent.contact.title}
                        subtitle={siteContent.contact.subtitle}
                        className="mb-0 text-white"
                    />
                    {/* Override subtitle color */}
                    <p className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed text-center -mt-8">
                        {siteContent.contact.subtitle}
                    </p>
                </Container>
            </div>

            <Container className="py-24 -mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form */}
                    <div className="order-2 lg:order-1">
                        <ContactForm />
                    </div>

                    {/* Info */}
                    <div className="order-1 lg:order-2 space-y-8">
                        {/* Locations */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-display text-2xl font-bold mb-6">Our Locations</h3>
                            <div className="space-y-8">
                                {siteContent.locations.map((loc) => (
                                    <div key={loc.id}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="bg-blush/20 p-2 rounded-full">
                                                <MapPin className="w-5 h-5 text-brand" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{loc.name}</h4>
                                                <p className="text-gray-600 mb-2">{loc.address}</p>
                                                <a href={loc.mapUrl} target="_blank" className="text-sm text-brand font-medium hover:underline">Open in Maps</a>
                                            </div>
                                        </div>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                                            <iframe
                                                src={loc.mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-brand-dark text-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-display text-2xl font-bold mb-6">Quick Contact</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 opacity-80" />
                                    <a href={`tel:${siteContent.brand.socials.phone}`} className="hover:underline">{siteContent.brand.socials.phone}</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 opacity-80" />
                                    <a href={`mailto:${siteContent.brand.socials.email}`} className="hover:underline">{siteContent.brand.socials.email}</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 opacity-80" />
                                    <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24 max-w-3xl mx-auto">
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
