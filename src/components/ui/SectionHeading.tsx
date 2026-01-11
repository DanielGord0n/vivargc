import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}

export function SectionHeading({ title, subtitle, centered = true, className }: SectionHeadingProps) {
    return (
        <div className={cn("mb-12", centered && "text-center", className)}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-brand-dark mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="font-sans text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    {subtitle}
                </p>
            )}
            {centered && <div className="h-1 w-20 bg-blush mx-auto mt-6 rounded-full" />}
        </div>
    );
}
