import { SiteContent } from "./types";

/**
 * EDIT THIS FILE TO UPDATE SITE CONTENT
 * 
 * Instructions:
 * - Update `locations` to change addresses.
 * - Update `schedule` to change class times.
 * - Add/Remove items in `programs`, `coaches`, `testimonials` as needed.
 * - To enable Google Form registration, paste the form URL into `registration.googleFormUrl`.
 * - Images should be placed in `public/` and referenced here (e.g., "/coach1.jpg").
 */

export const siteContent: SiteContent = {
    brand: {
        name: "Viva RGC",
        description: "Luxury Rhythmic Gymnastics in Toronto",
        socials: {
            instagram: "https://www.instagram.com/viva_rgc/",
            facebook: "https://www.facebook.com/vivarhythmicgymnastics",
            email: "nathaly.vivier@gmail.com",
            phone: "(647) 501-9218",
        },
    },
    nav: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Schedule", href: "/schedule" },
        { label: "Coaches", href: "/coaches" },
        { label: "Gallery", href: "/gallery" },
        { label: "Registration", href: "/registration" },
        { label: "Contact", href: "/contact" },
    ],
    locations: [
        {
            id: "scarborough",
            name: "Scarborough",
            address: "291 Progress Ave, Scarborough, ON M1P 2Z2",
            mapUrl: "https://www.google.com/maps/place/Viva+Rhythmic+Gymnastics/@43.7729479,-79.2703913,16z/data=!3m1!4b1!4m6!3m5!1s0x89d4d198535a4e09:0xe8f2c5144bbc830a!8m2!3d43.7729479!4d-79.2703913!16s%2Fg%2F11bxj823yl?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D",
            mapEmbedUrl: "https://maps.google.com/maps?q=291+Progress+Ave,+Scarborough,+ON+M1P+2Z2&t=&z=15&ie=UTF8&iwloc=&output=embed",
        },
        {
            id: "bayview", // Keeping ID stable to avoid breaking other references if keys are used elsewhere (like schedule)
            name: "North York", // Updated Name
            address: "2737 Bayview Avenue, Toronto, ON M2L 1C5",
            mapUrl: "https://www.google.com/maps/place/Viva+Rhythmic+Gymnastics+-+North+York/@43.7620432,-79.3871195,17.93z/data=!4m6!3m5!1s0x882b2d08ea8792f9:0x6fd3888472773796!8m2!3d43.7609803!4d-79.3859252!16s%2Fg%2F11mypm8lzr?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D",
            mapEmbedUrl: "https://maps.google.com/maps?q=2737+Bayview+Avenue,+Toronto,+ON+M2L+1C5&t=&z=15&ie=UTF8&iwloc=&output=embed",
        },
    ],
    hero: {
        headline: "Rhythmic Gymnastics Training in Toronto",
        subhead: "Home to Team Canada gymnasts. Beginner-friendly and competition-driven programs focused on confidence, artistry, and athletic excellence.",
        primaryCta: "Book a Free Trial Class",
        secondaryCta: "View Programs",
        badgeText: "Est. 2014",
    },
    programs: [
        {
            title: "Recreational",
            slug: "recreational",
            ages: "Ages 3+",
            description: "Fun, engaging classes that introduce the fundamentals of rhythmic gymnastics with ribbons, hoops, and balls.",
        },
        {
            title: "Competitive Team",
            slug: "competitive",
            ages: "By Audition",
            description: "Intensive training for athletes aiming for provincial and national level competitions.",
        },
        {
            title: "Private Lessons",
            slug: "private-lessons",
            ages: "All Ages",
            description: "One-on-one coaching to refine technique, master routines, or prepare for special events.",
        },
        {
            title: "Summer Camps",
            slug: "camps",
            ages: "Ages 5-12",
            description: "Full-day camps featuring gymnastics, dance, crafts, and outdoor activities.",
        },
    ],
    coaches: [
        {
            name: "Nathaly Vivier",
            role: "Head Coach & Founder",
            bio: "Former national team member with over 15 years of coaching experience. Passionate about developing confident, artistic athletes.",
            image: "/placeholders/coach1.png",
            credentials: ["NCCP Level 3 Certified", "Former National Judge", "Bachelor of Kinesiology"],
            specialties: ["Technique", "Choreography", "Flexibility"],
        },
        {
            name: "Elena K.",
            role: "Senior Coach",
            bio: "Specializes in ballet training for rhythmic gymnasts and developing clean body technique.",
            image: "/placeholders/coach2.png",
            credentials: ["NCCP Level 2 Certified", "Professional Ballerina"],
            specialties: ["Ballet", "Routine Composition"],
        },
    ],
    schedule: {
        scarborough: {
            Monday: [
                { time: "5:00 PM - 6:00 PM", group: "Recreational (Age 5-7)" },
                { time: "6:00 PM - 8:00 PM", group: "Interclub Team" },
            ],
            Wednesday: [
                { time: "5:30 PM - 7:00 PM", group: "Advanced Rec" },
                { time: "7:00 PM - 9:00 PM", group: "Provincial Team" },
            ],
            Saturday: [
                { time: "9:00 AM - 10:00 AM", group: "Tiny Tots (Age 3-4)" },
                { time: "10:00 AM - 12:00 PM", group: "Recreational 1" },
                { time: "12:00 PM - 4:00 PM", group: "Competitive Team" },
            ],
        },
        bayview: {
            Tuesday: [
                { time: "4:30 PM - 6:00 PM", group: "Recreational Open" },
            ],
            Thursday: [
                { time: "5:00 PM - 7:00 PM", group: "Pre-Competitive" },
            ],
        },
    },
    testimonials: [
        {
            text: "Viva RGC has transformed my daughter's confidence. The coaches are supportive and highly skilled.",
            author: "Sarah M.",
            role: "Parent",
        },
        {
            text: "The perfect balance of fun and discipline. We love the elegant atmosphere and professional training.",
            author: "Jessica T.",
            role: "Parent",
        },
    ],
    gallery: [
        { src: "/images/Viva1.png", category: "Performance", alt: "Ribbon routine" },
        { src: "/images/Viva2.png", category: "Training", alt: "Floor exercise" },
        { src: "/images/Viva3.png", category: "Training", alt: "Training session" },
        { src: "/images/Viva4.png", category: "Performance", alt: "Competition readiness" },
        { src: "/images/Viva5.png", category: "Performance", alt: "Artistic pose" },
        { src: "/images/Viva6.png", category: "Training", alt: "Flexibility training" },
        { src: "/images/Viva8.png", category: "Training", alt: "Stretching" },
        { src: "/images/Viva9.png", category: "Performance", alt: "Competition event" },
        { src: "/images/Viva10.png", category: "Performance", alt: "Group routine" },
        { src: "/images/Viva11.png", category: "Training", alt: "Balance work" },
    ],
    faqs: [
        {
            question: "What should my child wear to the first class?",
            answer: "Form-fitting athletic wear like leggings and a tank top. Hair should be pulled back in a bun. No jewelry.",
        },
        {
            question: "Do we need to buy equipment?",
            answer: "Equipment requirements will be discussed in person based on your child's specific needs and level.",
        },
        {
            question: "Are trial classes free?",
            answer: "Yes! Every person is offered one free trial class to experience our training before registering.",
        },
    ],
    registration: {
        googleFormUrl: "", // Paste your Google Form URL here to enable the embed
    },
    contact: {
        title: "Get in Touch",
        subtitle: "We'd love to hear from you. Contact us for trial classes, assessments, and general inquiries.",
    },
};
