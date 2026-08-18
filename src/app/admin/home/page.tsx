"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Plus, Trash2, Upload } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";

interface HomeContent {
    hero: {
        headline: string;
        subhead: string;
        primaryCta: string;
        secondaryCta: string;
        heroImage: string;
    };
    galleryPreview: string[];
    locations: {
        id: string;
        name: string;
        address: string;
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
}

const defaultContent: HomeContent = {
    hero: {
        headline: "Rhythmic Gymnastics Training in Toronto",
        subhead: "Home to Team Canada gymnasts. Beginner-friendly and competition-driven programs focused on confidence, artistry, and athletic excellence.",
        primaryCta: "Book a Free Trial Class",
        secondaryCta: "View Programs",
        heroImage: "/images/Viva4.png",
    },
    galleryPreview: ["/images/Viva1.png", "/images/Viva2.png", "/images/Viva3.png", "/images/Viva8.png"],
    locations: [
        { id: "scarborough", name: "Scarborough", address: "291 Progress Ave, Scarborough, ON M1P 2Z2" },
        { id: "bayview", name: "North York", address: "2737 Bayview Avenue, Toronto, ON M2L 1C5" },
    ],
    faqs: [
        { question: "What should my child wear to the first class?", answer: "Form-fitting athletic wear like leggings and a tank top. Hair should be pulled back in a bun. No jewelry." },
        { question: "Do we need to buy equipment?", answer: "Equipment requirements will be discussed in person based on your child's specific needs and level." },
        { question: "Are trial classes free?", answer: "Yes! Every person is offered one free trial class to experience our training before registering." },
    ],
};

export default function HomeAdmin() {
    const [content, setContent] = useState<HomeContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/pages/home");
            if (res.ok) {
                const data = await res.json();
                if (data.content && Object.keys(data.content).length > 0) {
                    // Merge with defaults to ensure all fields exist
                    setContent({
                        ...defaultContent,
                        ...data.content,
                        hero: { ...defaultContent.hero, ...data.content.hero },
                        galleryPreview: data.content.galleryPreview || defaultContent.galleryPreview,
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch home content:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/pages/home", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                alert("Home page saved successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            console.error("Failed to save:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "heroImage" | number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(typeof field === "number" ? `gallery-${field}` : field);

        try {
            const data = await uploadFile(file);

            if (data.path) {
                if (field === "heroImage") {
                    setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, heroImage: data.path }
                    }));
                } else {
                    setContent(prev => ({
                        ...prev,
                        galleryPreview: prev.galleryPreview.map((img, i) =>
                            i === field ? data.path : img
                        )
                    }));
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(null);
        }
    };

    const updateHero = (field: keyof HomeContent["hero"], value: string) => {
        setContent(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const updateLocation = (index: number, field: "name" | "address", value: string) => {
        setContent(prev => ({
            ...prev,
            locations: prev.locations.map((loc, i) =>
                i === index ? { ...loc, [field]: value } : loc
            )
        }));
    };

    const updateFaq = (index: number, field: "question" | "answer", value: string) => {
        setContent(prev => ({
            ...prev,
            faqs: prev.faqs.map((faq, i) =>
                i === index ? { ...faq, [field]: value } : faq
            )
        }));
    };

    const addFaq = () => {
        setContent(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: "", answer: "" }]
        }));
    };

    const deleteFaq = (index: number) => {
        setContent(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Home Page</h1>
                    <p className="text-gray-600 mt-1">Edit hero, images, locations, and FAQs</p>
                </div>
                <button
                    onClick={saveContent}
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Hero Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Hero Section</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                        <input
                            type="text"
                            value={content.hero.headline}
                            onChange={(e) => updateHero("headline", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
                        <textarea
                            value={content.hero.subhead}
                            onChange={(e) => updateHero("subhead", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button</label>
                            <input
                                type="text"
                                value={content.hero.primaryCta}
                                onChange={(e) => updateHero("primaryCta", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
                            <input
                                type="text"
                                value={content.hero.secondaryCta}
                                onChange={(e) => updateHero("secondaryCta", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                        <div className="flex items-start gap-4">
                            <div className="relative w-40 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                {content.hero.heroImage && (
                                    <Image
                                        src={content.hero.heroImage}
                                        alt="Hero"
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <label className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${uploading === "heroImage" ? "opacity-50" : ""}`}>
                                <Upload className="w-4 h-4" />
                                {uploading === "heroImage" ? "Uploading..." : "Change Image"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "heroImage")}
                                    disabled={uploading === "heroImage"}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Preview Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Gallery Preview (4 images shown on homepage)</h2>

                <div className="grid grid-cols-4 gap-4">
                    {content.galleryPreview.map((img, index) => (
                        <div key={index} className="relative">
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {img && (
                                    <Image
                                        src={img}
                                        alt={`Gallery ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <label className={`absolute bottom-2 right-2 p-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-50 ${uploading === `gallery-${index}` ? "opacity-50" : ""}`}>
                                <Upload className="w-4 h-4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    disabled={uploading === `gallery-${index}`}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            {/* Locations Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Locations</h2>

                <div className="space-y-6">
                    {content.locations.map((location, index) => (
                        <div key={location.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={location.name}
                                        onChange={(e) => updateLocation(index, "name", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        value={location.address}
                                        onChange={(e) => updateLocation(index, "address", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQs Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">FAQs</h2>
                    <button
                        onClick={addFaq}
                        className="flex items-center gap-2 text-brand hover:text-brand/80"
                    >
                        <Plus className="w-5 h-5" />
                        Add FAQ
                    </button>
                </div>

                <div className="space-y-4">
                    {content.faqs.map((faq, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-3">
                                <span className="text-sm font-medium text-gray-500">FAQ {index + 1}</span>
                                <button
                                    onClick={() => deleteFaq(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Question"
                                    value={faq.question}
                                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                                <textarea
                                    placeholder="Answer"
                                    value={faq.answer}
                                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
