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
        { label: "Events", href: "/billboard" },
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
            name: "Natalia Kachaiev",
            role: "Founder, Head Coach & Brevet Judge",
            bio: "As Founder and Head Coach at Viva RGC, Natalia Kachaiev takes great pride in developing national athletes who consistently attain the coveted High Performance status (top 15 in Canada) at both junior and senior levels and regularly become part of Canada’s National Team. Natalia has travelled extensively worldwide with Canada’s top individual RG athletes, competing at World Cups, the Pan American Games, and various international tournaments. Notably, in 2019, one of her gymnasts placed in the top 10 in the world. A highly respected official, Natalia holds a Level 4 Brevet Judge certification for RG groups and Level 3 for RG individuals, leading to frequent invitations to judge at national, provincial, and international tournaments. She is passionate about sharing her vast experience and deep understanding of world-class rhythmic gymnastics with her students.",
            image: "/images/NataliaKachaiev.jpeg",
            images: ["/images/NataliaKachaiev.jpeg", "/images/NataliaKachaiev2.jpeg"],
            credentials: ["Brevet Judge (Level 4 Group/Level 3 Ind.)", "High Performance Coach", "Coach of Top 10 World Gymnast"],
            specialties: ["High Performance", "Elite Competition", "Judging Strategy"],
        },

        {
            name: "Tatyana Saakian",
            role: "Senior Coach",
            bio: "Tatyana began her rhythmic gymnastics training at the young age of 5. Throughout her training, she engaged in intensive practice and competed internationally, earning numerous gold and silver medals in various tournaments. Notably, she was also a member of the National Team of Lithuania and participated in the European Championship. In 2008, Tatyana took on the role of Head Coach at Toronto RG, where she has successfully led her gymnasts to victories at International, National, and Provincial championships. Her extensive experience and dedication to the sport have greatly contributed to the development of her athletes. Tatyana holds a Master of Sport degree and has achieved Level 3 certification at the Canadian level, further showcasing her expertise in rhythmic gymnastics coaching.",
            image: "/images/TatyanaSaakian1.jpeg",
            images: ["/images/TatyanaSaakian1.jpeg", "/images/TatyanaSaakian2.jpeg"],
            credentials: ["Master of Sport", "NCCP Level 3 Certified", "National Team (Lithuania)"],
            specialties: ["High Performance", "Technique", "Routine Composition"],
        },
        {
            name: "Olga Pasternak",
            role: "Ballet Instructor & Choreographer",
            bio: "Olga began her rigorous ballet education at the Kyiv State Choreographic School from 1998 to 2006, followed by earning a B.A. with honours in Choreography, Ballet Teaching, and Ballet Direction at Kyiv National Karpenko‑Karyi University (2006–2011). In 2006, she joined the Kyiv Municipal Academy Theatre for Children and Youth as a soloist before moving on in 2014 to the Kyiv City Ballet, where by 2017 she had ascended to the rank of principal dancer. Her performance repertoire reflects remarkable versatility, encompassing major classical and character roles: Masha, Spanish dance, and Shepherdess in The Nutcracker; Odette/Odile in Swan Lake; Juliet in Romeo and Juliet—for which she was voted “Best Juliet” in Ukraine during the 2018–19 season; and roles in Sleeping Beauty, Cinderella, Thumbelina, Giselle, Don Quixote, Balanchine’s Tarantella, and Les Sylphides. Her talent has taken her on international tours through North America, Europe, Japan, China, Brazil, and beyond. In 2022, Olga and her husband, Vladyslav Romashchenko, transitioned to Canada amid the war in Ukraine, having raised over $800,000 for humanitarian relief through performances in Europe, Japan, and the U.S. Since relocating, she’s been embraced by the Bayview School of Ballet School community— as both soloist and instructor—and continues to perform in high-profile productions such as The Nutcracker and Innovative Ballet Theatre. Beyond the stage, Olga is also actively committed to dance education, sharing her classical expertise with students in Canada and preserving her dedication to the art form.",
            image: "/images/OlgaPasternak1.jpeg",
            images: ["/images/OlgaPasternak1.jpeg", "/images/OlgaPasternak2.jpeg"],
            credentials: ["B.A. Choreography (Honours)", "Principal Dancer (Kyiv City Ballet)", "Best Juliet in Ukraine (2018-19)"],
            specialties: ["Ballet Technique", "Character Dance", "Choreography"],
        },
        {
            name: "Yulia Dallami",
            role: "Recreational & Pre-Competitive Coach",
            bio: "Yulia has been passionate about rhythmic gymnastics since childhood. She trained and competed internationally, earning numerous medals and obtaining a Master of Sport degree in Rhythmic Gymnastics. Since 2022, she has been coaching in Canada, specializing in working with young children at our North York (Bayview) location. Yulia excels in conducting intensive individual training and has successfully led her gymnasts to victories, combining professional expertise with a nurturing approach for young athletes.",
            image: "/images/YuliaDallami.jpeg",
            images: ["/images/YuliaDallami.jpeg"],
            credentials: ["Master of Sport", "International Medalist", "Early Development Specialist"],
            specialties: ["Recreational Development", "Foundational Technique", "Youth Training"],
        },
    ],
    schedule: {
        scarborough: {
            Monday: [
                { time: "3:00 PM - 8:00 PM", group: "Provincial & National Group" },
            ],
            Tuesday: [
                { time: "4:00 PM - 7:00 PM", group: "National Group" },
            ],
            Wednesday: [
                { time: "4:00 PM - 7:30 PM", group: "Provincial Group" },
                { time: "4:30 PM - 6:30 PM", group: "Beginner Group" },
            ],
            Thursday: [
                { time: "4:00 PM - 7:00 PM", group: "National Group" },
            ],
            Friday: [
                { time: "4:00 PM - 7:00 PM", group: "Provincial & National Group" },
            ],
            Saturday: [
                { time: "9:00 AM - 12:00 PM", group: "Provincial Group" },
                { time: "10:00 AM - 2:00 PM", group: "National Group" },
                { time: "10:00 AM - 12:00 PM", group: "Beginners Group" },
            ],
        },
        bayview: {
            Tuesday: [
                { time: "7:00 PM - 10:00 PM", group: "Provincial Group" },
            ],
            Thursday: [
                { time: "5:00 PM - 7:00 PM", group: "Children Beginners" },
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
        { src: "/images/VivaVideo.mp4", category: "Video", alt: "Viva Rhythmic Gymnastics Highlights" },
        { src: "/images/VivaVideo2.mp4", category: "Video", alt: "Competition Highlights" },
        { src: "/images/NataliaKachaiev2.jpeg", category: "Performance", alt: "Coach Natalia" },
        { src: "/images/Viva17.jpeg", category: "Performance", alt: "Stage performance" },
        { src: "/images/Viva18.jpeg", category: "Training", alt: "Training moment" },
        { src: "/images/Viva19.jpeg", category: "Performance", alt: "Rhythmic gymnastics pose" },
        { src: "/images/Viva20.jpeg", category: "Training", alt: "Gymnast stretching" },
        { src: "/images/Viva21.jpeg", category: "Performance", alt: "Event photo" },
        { src: "/images/Viva22.jpeg", category: "Training", alt: "Practice session" },
        { src: "/images/Viva23.jpeg", category: "Performance", alt: "Gymnastics performance" },
        { src: "/images/Viva24.jpeg", category: "Training", alt: "Training session" },
        { src: "/images/Viva25.jpeg", category: "Performance", alt: "Competition moment" },
        { src: "/images/Viva26.jpeg", category: "Training", alt: "Gymnast pose" },
        { src: "/images/Viva27.jpeg", category: "Performance", alt: "Artistic routine" },
        { src: "/images/Viva12.jpeg", category: "Training", alt: "Gymnastics training" },
        { src: "/images/Viva13.jpeg", category: "Performance", alt: "On stage performance" },
        { src: "/images/Viva14.jpeg", category: "Training", alt: "Flexibility training" },
        { src: "/images/Viva15.jpeg", category: "Performance", alt: "Competition routine" },
        { src: "/images/Viva16.jpeg", category: "Training", alt: "Gymnast in action" },
        { src: "/images/Viva1.png", category: "Performance", alt: "Ribbon routine" },
        { src: "/images/Viva2.png", category: "Training", alt: "Floor exercise" },
        { src: "/images/Viva3.png", category: "Training", alt: "Training session" },
        { src: "/images/Viva4.png", category: "Performance", alt: "Competition readiness" },
        { src: "/images/Viva5.png", category: "Performance", alt: "Artistic pose" },
        { src: "/images/Viva6.png", category: "Training", alt: "Flexibility training" },

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
