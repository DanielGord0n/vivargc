import contentData from '@/data/content.json';

// This module provides typed access to the CMS content
// The data is read at build time from content.json

export interface Coach {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    images: string[];
    credentials: string[];
    specialties: string[];
}

export interface GalleryItem {
    id: string;
    src: string;
    category: string;
    alt: string;
}

export interface ScheduleItem {
    time: string;
    group: string;
}

export interface Schedule {
    scarborough: Record<string, ScheduleItem[]>;
    bayview: Record<string, ScheduleItem[]>;
}

export interface Program {
    id: string;
    title: string;
    slug: string;
    ages: string;
    description: string;
}

export interface Content {
    coaches: Coach[];
    gallery: GalleryItem[];
    schedule: Schedule;
    programs: Program[];
}

// Export the content with proper types
export const cmsContent: Content = contentData as Content;

// Helper functions
export function getCoaches(): Coach[] {
    return cmsContent.coaches;
}

export function getGallery(): GalleryItem[] {
    return cmsContent.gallery;
}

export function getSchedule(): Schedule {
    return cmsContent.schedule;
}

export function getPrograms(): Program[] {
    return cmsContent.programs;
}
