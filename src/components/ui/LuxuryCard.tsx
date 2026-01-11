import { cn } from "@/lib/utils";

interface LuxuryCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function LuxuryCard({ children, className, onClick }: LuxuryCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-2xl p-8 shadow-sm border border-transparent transition-all duration-300",
                "hover:shadow-lg hover:border-blush/30 hover:-translate-y-1",
                onClick && "cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
