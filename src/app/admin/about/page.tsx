"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

async function createBackup() {
    try {
        await fetch("/api/admin/backup", { method: "POST" });
    } catch (error) {
        console.error("Failed to create backup:", error);
    }
}


interface AboutContent {
    header: {
        title: string;
        subtitle: string;
    };
    story: {
        title: string;
        paragraph1: string;
        paragraph2: string;
    };
    quote: string;
    values: {
        title: string;
        description: string;
    }[];
    cta: {
        title: string;
        description: string;
    };
}

const defaultContent: AboutContent = {
    header: {
        title: "Our Story",
        subtitle: "Founded with a passion for rhythm, movement, and athlete development.",
    },
    story: {
        title: "A New Standard in Rhythmic Gymnastics",
        paragraph1: "Viva RGC was established to provide a nurturing yet competitive environment for gymnasts of all levels.",
        paragraph2: "Our facility is designed to inspire, and our curriculum is crafted to ensure every athlete reaches their full potential.",
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
    },
};

export default function AboutAdmin() {
    const [content, setContent] = useState<AboutContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/pages/about");
            if (res.ok) {
                const data = await res.json();
                if (data.content && Object.keys(data.content).length > 0) {
                    setContent({ ...defaultContent, ...data.content });
                }
            }
        } catch (error) {
            console.error("Failed to fetch about content:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        setSaving(true);
        try {
            await createBackup();

            const res = await fetch("/api/admin/pages/about", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });
            if (res.ok) {
                alert("About page saved successfully!");
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

    const updateValue = (index: number, field: "title" | "description", value: string) => {
        setContent(prev => ({
            ...prev,
            values: prev.values.map((val, i) =>
                i === index ? { ...val, [field]: value } : val
            )
        }));
    };

    const addValue = () => {
        setContent(prev => ({
            ...prev,
            values: [...prev.values, { title: "", description: "" }]
        }));
    };

    const deleteValue = (index: number) => {
        setContent(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">About Page</h1>
                    <p className="text-gray-600 mt-1">Edit story, values, and CTA sections</p>
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

            {/* Header Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Page Header</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={content.header.title}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                header: { ...prev.header, title: e.target.value }
                            }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                        <input
                            type="text"
                            value={content.header.subtitle}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                header: { ...prev.header, subtitle: e.target.value }
                            }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Our Story</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                            type="text"
                            value={content.story.title}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                story: { ...prev.story, title: e.target.value }
                            }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                        <textarea
                            value={content.story.paragraph1}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                story: { ...prev.story, paragraph1: e.target.value }
                            }))}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                        <textarea
                            value={content.story.paragraph2}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                story: { ...prev.story, paragraph2: e.target.value }
                            }))}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Featured Quote</h2>
                <input
                    type="text"
                    value={content.quote}
                    onChange={(e) => setContent(prev => ({ ...prev, quote: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    placeholder="Enter an inspiring quote..."
                />
            </section>

            {/* Values Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Our Values</h2>
                    <button
                        onClick={addValue}
                        className="flex items-center gap-2 text-brand hover:text-brand/80"
                    >
                        <Plus className="w-5 h-5" />
                        Add Value
                    </button>
                </div>

                <div className="space-y-4">
                    {content.values.map((value, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between mb-3">
                                <span className="text-sm font-medium text-gray-500">Value {index + 1}</span>
                                <button
                                    onClick={() => deleteValue(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    type="text"
                                    placeholder="Title (e.g., Artistry)"
                                    value={value.title}
                                    onChange={(e) => updateValue(index, "title", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                                <textarea
                                    placeholder="Description"
                                    value={value.description}
                                    onChange={(e) => updateValue(index, "description", e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-6">Call to Action</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={content.cta.title}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                cta: { ...prev.cta, title: e.target.value }
                            }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={content.cta.description}
                            onChange={(e) => setContent(prev => ({
                                ...prev,
                                cta: { ...prev.cta, description: e.target.value }
                            }))}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
