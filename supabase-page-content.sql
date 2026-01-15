-- Page Content Table for Home and About page editing
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS page_content (
    page_id TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on page_content" ON page_content FOR ALL USING (true) WITH CHECK (true);

-- Insert default records for home and about pages
INSERT INTO page_content (page_id, content) VALUES 
('home', '{
    "hero": {
        "headline": "Rhythmic Gymnastics Training in Toronto",
        "subhead": "Home to Team Canada gymnasts. Beginner-friendly and competition-driven programs focused on confidence, artistry, and athletic excellence.",
        "primaryCta": "Book a Free Trial Class",
        "secondaryCta": "View Programs"
    },
    "locations": [
        {
            "id": "scarborough",
            "name": "Scarborough",
            "address": "291 Progress Ave, Scarborough, ON M1P 2Z2"
        },
        {
            "id": "bayview",
            "name": "North York",
            "address": "2737 Bayview Avenue, Toronto, ON M2L 1C5"
        }
    ],
    "faqs": [
        {
            "question": "What should my child wear to the first class?",
            "answer": "Form-fitting athletic wear like leggings and a tank top. Hair should be pulled back in a bun. No jewelry."
        },
        {
            "question": "Do we need to buy equipment?",
            "answer": "Equipment requirements will be discussed in person based on your child''s specific needs and level."
        },
        {
            "question": "Are trial classes free?",
            "answer": "Yes! Every person is offered one free trial class to experience our training before registering."
        }
    ]
}'::jsonb),
('about', '{
    "header": {
        "title": "Our Story",
        "subtitle": "Founded with a passion for rhythm, movement, and athlete development."
    },
    "story": {
        "title": "A New Standard in Rhythmic Gymnastics",
        "paragraph1": "Viva RGC was established to provide a nurturing yet competitive environment for gymnasts of all levels. We believe that rhythmic gymnastics is more than just a sport—it is an art form that builds character, discipline, and lifelong confidence.",
        "paragraph2": "Our facility is designed to inspire, and our curriculum is crafted to ensure every athlete reaches their full potential, whether they are taking their first steps on the carpet or competing on the national stage."
    },
    "quote": "Excellence is not an act, but a habit.",
    "values": [
        {"title": "Artistry", "description": "We emphasize expression, musicality, and grace in every movement."},
        {"title": "Athleticism", "description": "Building strong bodies and minds through rigorous, safe training."},
        {"title": "Confidence", "description": "Empowering athletes to believe in themselves both on and off the carpet."}
    ],
    "cta": {
        "title": "Join the Viva Family",
        "description": "Experience the difference of a club that puts athletes first. Book a trial class today."
    }
}'::jsonb)
ON CONFLICT (page_id) DO NOTHING;
