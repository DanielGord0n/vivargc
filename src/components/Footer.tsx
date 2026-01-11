import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { Container } from "@/components/ui/Container";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-blush/20 pt-16 pb-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <h3 className="font-display text-2xl font-bold text-brand mb-4">{siteContent.brand.name}</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            {siteContent.hero.subhead}
                        </p>
                        <div className="flex gap-4">
                            <a href={siteContent.brand.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-dark transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href={siteContent.brand.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-dark transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Explore</h4>
                        <ul className="space-y-3">
                            {siteContent.nav.slice(0, 4).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-gray-600 hover:text-brand text-sm transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Connect</h4>
                        <ul className="space-y-3">
                            {siteContent.nav.slice(4).map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-gray-600 hover:text-brand text-sm transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-sans font-semibold text-gray-900 mb-4">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                                <span>{siteContent.brand.socials.phone}</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                                <a href={`mailto:${siteContent.brand.socials.email}`} className="hover:text-brand transition-colors">
                                    {siteContent.brand.socials.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                                <span>
                                    Scarborough & Bayview<br />
                                    <Link href="/contact" className="text-brand text-xs font-medium hover:underline">View Locations</Link>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>&copy; {currentYear} {siteContent.brand.name}. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
