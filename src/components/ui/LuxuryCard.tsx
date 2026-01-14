import { cn } from "@/lib/utils";

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function LuxuryCard({ children, className, ...props }: LuxuryCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl p-8 shadow-sm border border-transparent transition-all duration-300",
                "hover:shadow-lg hover:border-blush/30 hover:-translate-y-1",
                props.onClick && "cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
