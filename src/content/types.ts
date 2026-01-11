export interface NavItem {
    label: string;
    href: string;
}

export interface SocialLinks {
    instagram: string;
    facebook: string;
    email: string;
    phone: string;
}

export interface Location {
    name: string;
    address: string;
    mapUrl: string; // Embed URL or Google Maps link
    id: string;
}

export interface HeroContent {
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    badgeText: string;
}

export interface Program {
    title: string;
    slug: string; // for potential dynamic routing or linking
    ages: string;
    description: string;
    image?: string; // path to image
}

export interface Coach {
    name: string;
    role: string;
    bio: string;
    image: string;
    credentials: string[];
    specialties: string[];
}

export interface ScheduleItem {
    time: string;
    group: string;
}

export interface DailySchedule {
    [day: string]: ScheduleItem[];
}

export interface LocationSchedule {
    [locationId: string]: {
        [day: string]: ScheduleItem[];
    };
}

export interface Testimonial {
    text: string;
    author: string;
    role?: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface GalleryItem {
    src: string;
    category: "Training" | "Performance" | "Event" | "Video";
    alt: string;
}

export interface SiteContent {
    brand: {
        name: string;
        description: string;
        socials: SocialLinks;
    };
    nav: NavItem[];
    locations: Location[];
    hero: HeroContent;
    programs: Program[];
    coaches: Coach[];
    schedule: LocationSchedule;
    testimonials: Testimonial[];
    gallery: GalleryItem[];
    faqs: FaqItem[];
    registration: {
        googleFormUrl: string; // If empty, show contact info
    };
    contact: {
        title: string;
        subtitle: string;
    };
}
