"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/content/siteContent";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "Scarborough",
        message: "",
        newsletter: false,
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Simulate submission or prepare mailto
        const subject = `Viva RGC Inquiry from ${formData.name}`;
        const body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nLocation Pref: ${formData.location}\nNewsletter Signup: ${formData.newsletter ? 'Yes' : 'No'}\n\nMessage:\n${formData.message}`;

        // In a real app, send to API. Here we provide mailto fallback.
        window.location.href = `mailto:${siteContent.brand.socials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (submitted) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-blush/20">
                <h3 className="text-2xl font-display font-bold text-brand-dark mb-4">Thank you!</h3>
                <p className="text-gray-600 mb-6">
                    We've prepared an email drafting for you. If it didn't open, please click below.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-6 text-center">Send us a Message</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Name</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
                    <select
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none bg-white"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    >
                        {siteContent.locations.map(loc => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Tell us about your child's age, experience, and what programs you're interested in..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
            </div>

            <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={formData.newsletter}
                            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-brand peer-checked:border-brand transition-all" />
                        <svg
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                        Sign up for news and updates
                    </span>
                </label>
            </div>

            <Button type="submit" className="w-full">
                Send Message
            </Button>
        </form>
    );
}
